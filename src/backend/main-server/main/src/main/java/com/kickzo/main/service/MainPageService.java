package com.kickzo.main.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kickzo.main.RoomDocument;
import com.kickzo.main.RoomSearchRepository;
import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.dto.request.CreateRoomRequestDto;
import com.kickzo.main.dto.response.CreateRoomResponseDto;
import com.kickzo.main.dto.response.RoomResponseDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.entity.Playlist;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.repository.RoomUserRepository;
import com.kickzo.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MainPageService {

	private final RoomRepository roomRepository;
	private final RoomUserRepository roomUserRepository;
	private final UserRepository userRepository;
	private final RoomSearchRepository roomSearchRepository; // Elasticsearch Repository

	private static final int MAX_ROOMS_PER_USER = 5;
	private static final int ROLE_CREATOR = 0;

	// 메인 페이지 방 list 제공
	@Transactional(readOnly = true)
	public List<RoomResponseDto> getAllRooms(Pageable pageable) {
		List<Room> rooms = roomRepository.findAllByUserCountDesc(pageable);
		return rooms.stream()
			.map(this::convertToDto) // Room 엔티티를 DTO로 변환
			.collect(Collectors.toList());
	}

	// 본인이 소속한 방 list 제공
	@Transactional(readOnly = true)
	public List<RoomResponseDto> getUserRooms(Long userId) {
		List<Room> rooms = roomUserRepository.findRoomsByUserId(userId);

		return rooms.stream()
			.map(this::convertToDto)
			.collect(Collectors.toList());
	}

	// 방 만들기
	@Transactional
	public CreateRoomResponseDto createRoom(Long userId, CreateRoomRequestDto requestDto) {

		String randomCode = generateRandomCode();
		String creatorNickname = userRepository.findNicknameById(userId);

		Room newRoom = saveNewRoom(creatorNickname, requestDto, randomCode);
		saveRoomUser(newRoom.getId(), userId);

		// Elasticsearch에도 저장
		RoomDocument roomDocument = new RoomDocument();
		roomDocument.setRoomId(newRoom.getId());
		roomDocument.setTitle(newRoom.getTitle());
		roomDocument.setCreator(newRoom.getCreator());
		roomSearchRepository.save(roomDocument);

		return new CreateRoomResponseDto(randomCode);
	}

	public RoomResponseDto convertToDto(Room room) {
		List<PlaylistItem> playlistItems = Optional.ofNullable(room.getPlaylist())
			.map(Playlist::getOrderAsList)  // JSON → List 변환
			.orElse(Collections.emptyList());

		String playlistUrl = extractPlaylistUrl(playlistItems);

		return RoomResponseDto.builder()
			.roomId(room.getId())
			.code(room.getCode())
			.title(room.getTitle())
			.description(room.getDescription())
			.isPublic(room.getIsPublic())
			.creator(room.getCreator())
			.profileImageUrl(getCreatorProfileImage(room.getCreator()))
			.userCount(room.getUserCount())
			.playlistUrl(playlistUrl)
			.build();
	}

	/**
	 * 메인 페이지에서 방 list 제공
	 * 1. Playlist에서 order == 0인 URL 추출 : extractPlaylistUrl
	 * 2. getCreatorProfileImage : 생성자의 profileImageUrl 받아오기
	 */
	private String extractPlaylistUrl(List<PlaylistItem> playlistItems) {
		return playlistItems.stream()
			.filter(item -> item.getOrder() == 0)
			.map(PlaylistItem::getUrl)
			.findFirst()
			.orElse(null);
	}

	private String getCreatorProfileImage(String creator) {
		return userRepository.findProfileImageUrlByNickname(creator);
	}

	/**
	 * 새로운 방 만들기
	 * 1. 임의의 roomcode 생성 : generateRandomCode
	 * 2. Room에 저장 : saveNewRoom
	 * 3. RoomUser에 저장 : saveRoomUser
	 */
	private String generateRandomCode() {
		return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase();
	}

	private Room saveNewRoom(String creatorNickname, CreateRoomRequestDto requestDto, String randomCode) {

		int roomCount = roomRepository.findAllByCreator(creatorNickname).size();

		if (roomCount >= MAX_ROOMS_PER_USER) {
			throw new CustomException(CustomErrorCode.ROOM_LIMIT_EXCEEDED);
		}

		Room newRoom = Room.builder()
			.title(requestDto.getTitle())
			.description(requestDto.getDescription())
			.isPublic(requestDto.getIsPublic())
			.code(randomCode)
			.creator(creatorNickname)
			.userCount(1)
			.createdAt(LocalDateTime.now())
			.build();

		return roomRepository.save(newRoom);
	}

	private void saveRoomUser(Long roomId, Long userId) {
		RoomUser roomUser = RoomUser.builder()
			.id(new RoomUserId(roomId, userId))
			.role(ROLE_CREATOR) // 0: creator 역할
			.joinedAt(LocalDateTime.now())
			.build();

		roomUserRepository.save(roomUser);
	}
}
