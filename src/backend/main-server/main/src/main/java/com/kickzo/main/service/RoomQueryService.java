package com.kickzo.main.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kickzo.main.repository.UserEnterRedisRepository;
import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.dto.response.RoomDetailsDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.dto.response.RoomInfoDto;
import com.kickzo.main.dto.response.UserInfoDto;
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
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RoomQueryService {

	private final RoomRepository roomRepository;
	private final RoomUserRepository roomUserRepository;
	private final PlaylistRepository playlistRepository;
	private final UserRepository userRepository;
	private final UserEnterRedisRepository userEnterRedisRepository;

	//방에 입장했을 때 방 정보 + 방 소속 유저 정보 + playlist 정보 제공
	public RoomEntryResponseDto getRoomJoinResponse(String roomCode, Long userId){
		int myRole = findUserRole(getRoomId(roomCode), userId);
		RoomDetailsDto roomDetails = assembleRoomDetails(roomCode);
		return new RoomEntryResponseDto(myRole, roomDetails);
	}

	public Integer findUserRole(Long roomId, Long userId) {
		return roomUserRepository.findRoleByUserIdAndRoomId(roomId, userId);
	}

	public List<UserInfoDto> getRoomParticipants(Long roomId) {
		return fetchUserList(roomId);
	}

	public Long getRoomId(String roomCode) {
		return Optional.ofNullable(roomRepository.findRoomIdByRoomCode(roomCode))
			.orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
	}
	public String getUserProfileImage(Long userId) {
		return userRepository.findProfileImageUrlById(userId);
	}

	public String getUserNickname(Long userId) {
		return userRepository.findNicknameById(userId);
	}

	//주어진 역할(Role)과 방 코드를 기반으로 Room의 전체 세부 정보 생성
	private RoomDetailsDto assembleRoomDetails(String roomCode) {
		Long roomId = getRoomId(roomCode);

		List<UserInfoDto> userList = fetchUserList(roomId);
		List<RoomInfoDto> roomInfo = fetchRoomInfo(roomId);
		List<PlaylistItem> playlist = fetchPlaylist(roomId);

		return new RoomDetailsDto(userList, roomInfo, playlist);
	}

	// Room ID를 기준으로 방에 참여한 유저의 ID, Role, 닉네임, 프로필 이미지 조회
	private List<UserInfoDto> fetchUserList(Long roomId) {
		Set<String> onlineUsers = userEnterRedisRepository.getOnlineUsers(roomId);

		List<Object[]> userIdRoles = roomUserRepository.findUsersByRoomId(roomId);
		return userIdRoles.stream()
			.map(userRole -> {
				Long userId = (Long) userRole[0];
				int role = (int) userRole[1];
				String nickname = getUserNickname(userId);
				String profileImageUrl = getUserProfileImage(userId);
				boolean isJoined = onlineUsers != null && onlineUsers.contains(String.valueOf(userId)); // 온라인 여부 체크
				return new UserInfoDto(userId, role, nickname, profileImageUrl, isJoined);
			})
			.collect(Collectors.toList());
	}

	// Room ID로 방의 정보를 조회하고 RoomInfoDto 리스트로 변환
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

	// Room ID를 기반으로 Playlist 정보를 JSON에서 List<PlaylistItem> 형태로 변환
	private List<PlaylistItem> fetchPlaylist(Long roomId) {
		return playlistRepository.findByRoomId(roomId)
			.map(Playlist::getOrderAsList)  // JSON → List 변환
			.orElse(Collections.emptyList());  // Playlist가 없으면 빈 리스트 반환
	}

	private String getCreatorProfileImage(String creatorNickname) {
		return userRepository.findProfileImageUrlByNickname(creatorNickname);
	}
}
