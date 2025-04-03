package com.kickzo.main.service;

import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kickzo.main.dto.response.UserInfoDto;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.enums.RoomRole;
import com.kickzo.main.repository.RoomUserRepository;
import com.kickzo.main.repository.UserEnterRedisRepository;
import com.kickzo.main.repository.UserOutRedisRepository;
import com.kickzo.main.search.service.SearchService;
import com.kickzo.main.dto.event.RoomUpdateEvent;
import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;
import com.kickzo.main.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RoomService {
	private final SearchService searchService;
	private final KafkaProducerService kafkaProducerService;
	private final RoomQueryService roomQueryService;
	private final RoomRepository roomRepository;
	private final RoomUserRepository roomUserRepository;
	private final UserEnterRedisRepository userEnterRedisRepository;
	private final UserOutRedisRepository userOutRedisRepository;

	public void joinRoom(String roomCode, Long userId) {
		// redis에 roomId와 userId 저장
		userEnterRoom(roomQueryService.getRoomId(roomCode), userId);
	}

	public void updateRoomInfo(RoomUpdateRequestDto updateRequestDto) {
		Long roomId = updateRequestDto.getRoomId();
		Room room = roomRepository.findById(roomId)
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
		room.setId(roomId);
		// update 할 내용이 title, description, isPublic 인지 확인
		boolean updated = false;

		if (updateRequestDto.getTitle() != null) {
			room.setTitle(updateRequestDto.getTitle());
			updated = true;
		}
		if (updateRequestDto.getDescription() != null) {
			room.setDescription(updateRequestDto.getDescription());
			updated = true;
		}
		if (updateRequestDto.getIsPublic() != null) {
			room.setIsPublic(updateRequestDto.getIsPublic());
			updated = true;
		}

		if (!updated) {
			throw new CustomException(CustomErrorCode.REQUIRED_UPDATE_FIELDS_MISSING);
		}

		roomRepository.save(room);
		searchService.indexRoom(room);
		RoomUpdateEvent event = new RoomUpdateEvent(roomId);
		event.setUpdatedFields(updateRequestDto);

		kafkaProducerService.sendRoomUpdateMessage(event);
	}

	// 방을 만든 사람이 나간다면,,?
	public void leaveRoom(Long roomId, Long userId) {
		Room room = roomRepository.findById(roomId)
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
		room.decrementUserCount();
		roomRepository.save(room);
		RoomUserId id = new RoomUserId(roomId, userId);
		roomUserRepository.deleteById(id);
		userOutRedisRepository.removeUserFromRoom(roomId, userId);
	}

	public void deleteRoom(Long roomId, Long userId) {
		// 삭제 권한 확인
		Integer role = roomUserRepository.findRoleByUserIdAndRoomId(roomId, userId);
		if (role == null || !Objects.equals(role, RoomRole.CREATOR.getValue())){
			throw new CustomException(CustomErrorCode.INVALID_ACCESS_ROLE);
		}
		roomRepository.deleteById(roomId);
		roomUserRepository.deleteByRoomId(roomId);
		userOutRedisRepository.removeRoom(roomId);
	}

	// 새로 들어온 유저 db에 저장 및 Room에 join한 유저를 Redis에 저장하여 실시간 방 사용자 트래킹
	private void userEnterRoom(Long roomId, Long userId) {
		assignUserRole(roomId, userId);
		userEnterRedisRepository.addUserToRoom(roomId, userId);
		sendRoomUserInfoToKafka(roomId, userId);
	}

	// 현재 유저가 해당 방에 소속되어있는 지 확인 후 저장
	private void assignUserRole(Long roomId, Long userId) {
		Integer role = roomQueryService.findUserRole(roomId, userId);
		if (role != null) {
			return;
		}
		saveUserCount(roomId);
		saveNewRoomUser(roomId, userId);
	}

	// Room ID를 기준으로 방의 유저 수를 1 증가시키고, 변경된 정보 저장
	private void saveUserCount(Long roomId){
		Room room = roomRepository.findById(roomId)
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
		room.incrementUserCount();
		roomRepository.save(room);
	}

	// RoomUser 엔티티를 생성하여 새로운 사용자를 방에 추가하고 기본 Role(ROLE_MEMBER)로 저장
	private void saveNewRoomUser(Long roomId, Long userId) {
		RoomUser roomUser = RoomUser.builder()
			.id(new RoomUserId(roomId, userId))
			.role(RoomRole.MEMBER.getValue()) // 2: member 역할
			.joinedAt(LocalDateTime.now())
			.build();
		roomUserRepository.save(roomUser);
	}

	// 새로운 유저가 들어왔음을 Kafka로 전송
	private void sendRoomUserInfoToKafka(Long roomId, Long userId) {
		String nickName = roomQueryService.getUserNickname(userId);
		String profileImageUrl = roomQueryService.getUserProfileImage(userId);
		kafkaProducerService.sendRoomUserInfo(roomId, new UserInfoDto(userId, RoomRole.MEMBER.getValue(), nickName, profileImageUrl, true));
	}
}
