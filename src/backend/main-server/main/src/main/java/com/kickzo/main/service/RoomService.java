package com.kickzo.main.service;

import static com.kickzo.main.service.MainPageService.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.kickzo.main.dto.event.PlaylistItem;
import com.kickzo.main.dto.event.RoomUpdateEvent;
import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.dto.response.RoomDetailsDto;
import com.kickzo.main.dto.response.RoomInfoDto;
import com.kickzo.main.dto.response.UserListDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;
import com.kickzo.main.repository.PlaylistRepository;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.repository.RoomUserRepository;
import com.kickzo.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomService {

	private final RoomRepository roomRepository;
	private final RoomUserRepository roomUserRepository;
	private final PlaylistRepository playlistRepository;
	private final UserRepository userRepository;
	private final KafkaProducerService kafkaProducerService;

	private static final int ROLE_MEMBER = 2;

	// roomCode에 따른 방의 정보와 유저 list 전달
	@Transactional
	public RoomDetailsDto getRoomDetails(String roomCode) {
		System.out.println("RoomCode : " + roomCode);
		if (roomCode == null || roomCode.isBlank()) {
			throw new CustomException(CustomErrorCode.INVALID_ROOM_CODE);
		}
		// Step 1: RoomCode로 RoomID 검색
		Long roomId = getRoomId(roomCode);

		// Step 2: RoomID로 UserID와 Role 목록 검색
		List<Object[]> userIdRoles = roomUserRepository.findUsersByRoomId(roomId);

		// Step 3: UserID로 Nickname 검색
		List<UserListDto> userList = getUserInfoList(userIdRoles);

		// Step 4: RoomID로 Room 정보와 Playlist Order 검색
		List<RoomInfoDto> roomInfo = getRoomInfoByRoomId(roomId);
		List<PlaylistItem> playlist = null;
		try {
			playlist = getPlaylistByRoomId(roomId);
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}

		// 결과를 조합하여 반환
		return new RoomDetailsDto(userList, roomInfo, playlist);
	}

	// 방에 유저 소속 여부에 따른 작업과 role 전달
	@Transactional
	public int getUserRole(String roomCode, Long userId) {
		Long roomId = getRoomId(roomCode);
		// Step 1: 해당 방에서 유저의 역할(Role)을 찾음
		Integer role = roomUserRepository.findRoleByUserIdAndRoomId(roomId, userId);
		if (role != null) {
			// Step 2: 역할(Role)이 존재하면 반환
			return role;
		} else {
			// Step 3: 역할(Role)이 존재하지 않으면 새 사용자 추가
			saveUserCount(roomId);
			saveNewRoomUser(roomId, userId);
			return ROLE_MEMBER;
		}
	}

	@Transactional
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
		RoomUpdateEvent event = new RoomUpdateEvent(roomId);
		event.setUpdatedFields(updateRequestDto);

		kafkaProducerService.sendRoomUpdateMessage(event);
	}

	/**
	 * roomCode에 따른 방의 정보와 유저 list 전달
	 * 1. roomCode로 roomId 뽑아오기 : getRoomId
	 * 2. UserId를 기반으로 닉네임 매핑 : mapNicknames
	 * 3. room 테이블에서 받아온 data를 dto로 변환 : getRoomInfoByRoomId
	 * 4. playlist 테이블에서 받아온 data를 dto로 변환 : getPlaylistByRoomId
	 */
	private Long getRoomId(String roomCode) {
		return Optional.ofNullable(roomRepository.findRoomIdByRoomCode(roomCode))
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
	}

	private List<UserListDto> getUserInfoList(List<Object[]> userIdRoles) {
		// UserID를 기반으로 Nickname을 매핑하는 로직
		return userIdRoles.stream()
			.map(userRole -> {
				Long userId = (Long)userRole[0];
				int role = (int)userRole[1];
				// UserRepository를 통해 UserID로 Nickname 조회
				String nickname = userRepository.findNicknameById(userId);
				String profileImageUrl= getUserProfileImage(userId);
				return new UserListDto(userId, role, nickname, profileImageUrl);
			})
			.collect(Collectors.toList());
	}

	private List<RoomInfoDto> getRoomInfoByRoomId(Long roomId) {
		return roomRepository.findRoomById(roomId)
			.stream()
			.map(room -> RoomInfoDto.builder()
				.roomId(room.getId())
				.code(room.getCode())
				.title(room.getTitle())
				.description(room.getDescription())
				.userCount(room.getUserCount())
				.creator(room.getCreator())
				.profileImageUrl(getCreatorProfileImage(room.getCreator()))
				.build())
			.collect(Collectors.toList());
	}

	private List<PlaylistItem> getPlaylistByRoomId(Long roomId) throws JsonProcessingException {
		String playlistJson = playlistRepository.findOrderById(roomId);
		if (playlistJson == null || playlistJson.isBlank()) {
			return new ArrayList<>();  // null 또는 빈 값 처리
		}
		return objectMapper.readValue(playlistJson, new TypeReference<>() {});
	}

	private String getCreatorProfileImage(String creator) {
		return Optional.ofNullable(userRepository.findProfileImageUrlByNickname(creator))
			.orElse("default-profile-image-url"); // 기본 이미지 설정
	}

	private String getUserProfileImage(Long userId) {
		return Optional.ofNullable(userRepository.findProfileImageUrlById(userId))
			.orElse("default-profile-image-url"); // 기본 이미지 설정
	}

	/**
	 *  새로 들어온 user -> count 증가
	 * 새로 들어온 user -> room_user DB에 저장
	 */
	private void saveUserCount(Long roomId){
		Room room = roomRepository.findById(roomId)
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
		room.incrementUserCount();
		roomRepository.save(room);
	}

	private void saveNewRoomUser(Long roomId, Long userId) {
		RoomUser roomUser = RoomUser.builder()
			.id(new RoomUserId(roomId, userId))
			.role(ROLE_MEMBER) // 2: member 역할
			.joinedAt(LocalDateTime.now())
			.build();
		roomUserRepository.save(roomUser);
	}
}
