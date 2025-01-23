package com.kickzo.main.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.kickzo.main.dto.PlaylistDto;
import com.kickzo.main.dto.RoomDetailsDto;
import com.kickzo.main.dto.RoomInfoDto;
import com.kickzo.main.dto.UserListDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.repository.PlaylistRepository;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.repository.RoomUserRepository;
import com.kickzo.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

	private final RoomRepository roomRepository;
	private final RoomUserRepository roomUserRepository;
	private final PlaylistRepository playlistRepository;
	private final UserRepository userRepository;
	
	// roomCode에 따른 방의 정보와 유저 list 전달
	public RoomDetailsDto getRoomDetails(String roomCode) {
		// Step 1: RoomCode로 RoomID 검색
		Long roomId = getRoomId(roomCode);

		// Step 2: RoomID로 UserID와 Role 목록 검색
		List<Object[]> userIdRoles = roomUserRepository.findUsersByRoomId(roomId);

		// Step 3: UserID로 Nickname 검색
		List<UserListDto> userList = mapNicknames(userIdRoles);

		// Step 4: RoomID로 Room 정보와 Playlist Order 검색
		List<RoomInfoDto> roomInfo = getRoomInfoByRoomId(roomId);
		List<PlaylistDto> playlist = getPlaylistByRoomId(roomId);

		// 결과를 조합하여 반환
		return new RoomDetailsDto(userList, roomInfo, playlist);
	}

	// 방에 유저 소속 여부에 따른 작업과 role 전달
	public int getUserRole(String roomCode, Long userId) {
		Long roomId = getRoomId(roomCode);
		// Step 1: 해당 방에서 유저의 역할(Role)을 찾음
		Integer role = roomUserRepository.findRoleByUserIdAndRoomId(userId, roomId);
		if (role != null) {
			// Step 2: 역할(Role)이 존재하면 반환
			return role;
		} else {
			// Step 3: 역할(Role)이 존재하지 않으면 새 사용자 추가
			saveNewRoomUser(roomId, userId);
			Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new IllegalArgumentException("Room not found"));
			room.incrementUserCount();
			return 2;
		}
	}

	/**
	 * roomCode에 따른 방의 정보와 유저 list 전달
	 * 1. roomCode로 roomId 뽑아오기 : getRoomId
	 * 2. UserId를 기반으로 닉네임 매핑 : mapNicknames
	 * 3. room 테이블에서 받아온 data를 dto로 변환 : getRoomInfoByRoomId
	 * 4. playlist 테이블에서 받아온 data를 dto로 변환 : getPlaylistByRoomId
	 */
	private Long getRoomId(String roomCode) {
		return roomRepository.findRoomIdByRoomCode(roomCode);
	}

	private List<UserListDto> mapNicknames(List<Object[]> userIdRoles) {
		// UserID를 기반으로 Nickname을 매핑하는 로직
		return userIdRoles.stream()
			.map(userRole -> {
				Long userId = (Long)userRole[0];
				int role = (int)userRole[1];
				// UserRepository를 통해 UserID로 Nickname 조회
				String nickname = userRepository.findNicknameById(userId);
				return new UserListDto(userId, role, nickname);
			})
			.collect(Collectors.toList());
	}

	private List<RoomInfoDto> getRoomInfoByRoomId(Long roomId) {
		return roomRepository.findRoomById(roomId)
			.stream()
			.map(room -> RoomInfoDto.builder()
				.roomId(room.getId())
				.title(room.getTitle())
				.description(room.getDescription())
				.userCount(room.getUserCount())
				.creator(room.getCreator())
				.build())
			.collect(Collectors.toList());
	}

	private List<PlaylistDto> getPlaylistByRoomId(Long roomId) {
		return playlistRepository.findOrderById(roomId)
			.stream()
			.map(playlist -> PlaylistDto.builder()
				.order(playlist.getOrder())
				.build())
			.collect(Collectors.toList());
	}

	/**
	 * 새로 들어온 user -> room_user DB에 저장
	 */
	private void saveNewRoomUser(Long roomId, Long userId) {
		RoomUser roomUser = RoomUser.builder()
			.id(new RoomUserId(roomId, userId))
			.role(2) // 0: creator 역할
			.joinedAt(LocalDateTime.now())
			.build();

		roomUserRepository.save(roomUser);
	}

	// 방 정보 수정 (방 제목, 설명, 플레이리스트 추가/수정/삭제, 권한 변경)
	// 방 안에서 친구 혹은 유저 초대하기 (초대 알림은 /queue로)
	// 받은 userId에서 이 방에 소속되지 않은 친구, 유저 찾아서 보내주기

}
