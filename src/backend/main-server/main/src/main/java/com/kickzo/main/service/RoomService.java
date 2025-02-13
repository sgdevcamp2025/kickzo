package com.kickzo.main.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.dto.event.RoomUpdateEvent;
import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.dto.response.RoomDetailsDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.dto.response.RoomInfoDto;
import com.kickzo.main.dto.response.UserListDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.entity.Playlist;
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

	@Transactional
	public RoomEntryResponseDto getRoomJoinResponse(String roomCode, Long userId){
		int myRole = determineUserRole(roomCode, userId);
		RoomDetailsDto roomDetails = assembleRoomDetails(myRole, roomCode);
		return new RoomEntryResponseDto(myRole, roomDetails);
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

	@Transactional(readOnly = true)
	public List<UserListDto> getRoomParticipants(Long roomId) {
		return fetchUserList(roomId);
	}

	/**
	 * roomCode에 따른 방의 정보와 유저 list 전달
	 * 1. 사용자 역할(Role) 확인, 비로그인 유저인 경우 기본 Role(99) 반환 : determineUserRole
	 * 2. 사용자 역할(Role) 조회, 존재하지 않으면 새 사용자로 등록 후 기본 Role(ROLE_MEMBER) 반환 : findOrAssignUserRole
	 * 3. 주어진 역할(Role)과 방 코드를 기반으로 Room의 전체 세부 정보 생성 : assembleRoomDetails
	 * 4. Room ID를 기준으로 방에 참여한 유저의 ID, Role, 닉네임, 프로필 이미지 조회 : fetchUserList
	 * 5. Room ID로 방의 정보를 조회하고 RoomInfoDto 리스트로 변환 : fetchRoomInfo
	 * 6. Room ID를 기반으로 Playlist 정보를 JSON에서 List<PlaylistItem> 형태로 변환 : fetchPlaylist
	 * 7. Room Code로 Room ID 조회, 존재하지 않으면 예외 발생 : getRoomId
	 * 8. 방 생성자의 닉네임을 기반으로 프로필 이미지 URL 조회, 없으면 기본 이미지 반환 : getCreatorProfileImage
	 * 9. 유저 ID를 기반으로 프로필 이미지 URL 조회, 없으면 기본 이미지 반환 : getUserProfileImage
	 * 10. Room ID를 기준으로 방의 유저 수를 1 증가시키고, 변경된 정보 저장 : saveUserCount
	 * 11. RoomUser 엔티티를 생성하여 새로운 사용자를 방에 추가하고 기본 Role(ROLE_MEMBER)로 저장 : saveNewRoomUser
	 */
	private int determineUserRole(String roomCode, Long userId) {
		if (userId == null) {
			return 99; // 비로그인 유저는 role = 99
		}
		Long roomId = getRoomId(roomCode);
		return findOrAssignUserRole(roomId, userId);
	}

	private int findOrAssignUserRole(Long roomId, Long userId) {
		// Step 1: 해당 방에서 유저의 역할(Role)을 찾음
		Integer role = roomUserRepository.findRoleByUserIdAndRoomId(roomId, userId);
		if (role != null) {
			// Step 2: 역할(Role)이 존재하면 반환
			return role;
		}
		// Step 3: 역할(Role)이 존재하지 않으면 새 사용자 추가
		saveUserCount(roomId);
		saveNewRoomUser(roomId, userId);
		return ROLE_MEMBER;
	}

	private RoomDetailsDto assembleRoomDetails(int myRole, String roomCode) {
		Long roomId = getRoomId(roomCode);

		List<UserListDto> userList = fetchUserList(roomId);
		List<RoomInfoDto> roomInfo = fetchRoomInfo(roomId);
		List<PlaylistItem> playlist = fetchPlaylist(roomId);

		if (myRole == ROLE_MEMBER) {
			kafkaProducerService.sendRoomUserList(roomId, userList);
		}

		return new RoomDetailsDto(userList, roomInfo, playlist);
	}

	private List<UserListDto> fetchUserList(Long roomId) {
		List<Object[]> userIdRoles = roomUserRepository.findUsersByRoomId(roomId);
		return userIdRoles.stream()
			.map(userRole -> {
				Long userId = (Long) userRole[0];
				int role = (int) userRole[1];
				String nickname = userRepository.findNicknameById(userId);
				String profileImageUrl = getUserProfileImage(userId);
				return new UserListDto(userId, role, nickname, profileImageUrl);
			})
			.collect(Collectors.toList());
	}

	private List<RoomInfoDto> fetchRoomInfo(Long roomId) {
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

	private List<PlaylistItem> fetchPlaylist(Long roomId) {
		return playlistRepository.findByRoomId(roomId)
			.map(Playlist::getOrderAsList)  // JSON → List 변환
			.orElse(Collections.emptyList());  // Playlist가 없으면 빈 리스트 반환
	}

	private Long getRoomId(String roomCode) {
		return Optional.ofNullable(roomRepository.findRoomIdByRoomCode(roomCode))
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
	}

	private String getCreatorProfileImage(String creatorNickname) {
		return userRepository.findProfileImageUrlByNickname(creatorNickname);
	}

	private String getUserProfileImage(Long userId) {
		return userRepository.findProfileImageUrlById(userId);
	}


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
