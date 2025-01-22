package com.kickzo.main.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.CreateRoomRequestDto;
import com.kickzo.main.dto.RoomResponseDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.repository.PlaylistRepository;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.repository.RoomUserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MainPageService {

	private final RoomRepository roomRepository;
	private final RoomUserRepository roomUserRepository;
	private final PlaylistRepository playlistRepository;

	// 메인 페이지 방 list 제공
	public List<RoomResponseDto> getAllRooms(Pageable pageable) {
		List<Room> rooms = roomRepository.findAllByUserCountDesc(pageable);

		return rooms.stream()
			.map(this::convertToDto) // Room 엔티티를 DTO로 변환
			.collect(Collectors.toList());
	}

	// 본인이 소속한 방 list 제공
	public List<RoomResponseDto> getUserRooms(Long userId) {
		List<Room> rooms = roomUserRepository.findRoomsByUserId(userId);

		return rooms.stream()
			.map(this::convertToDto)
			.collect(Collectors.toList());
	}

	// 방 만들기
	public String createRoom(Long userId, String creatorNickname, CreateRoomRequestDto requestDto) {

		String randomCode = generateRandomCode();

		Room newRoom = saveNewRoom(requestDto, creatorNickname, randomCode);
		saveRoomUser(newRoom.getId(), userId);

		return randomCode; // 생성된 방 코드를 반환
	}

	/**
	 * 메인 페이지에서 방 list 제공
	 * 1. Playlist에서 order == 0인 URL 추출 : extractPlaylistUrl
	 * 2. Room 엔티티를 DTO로 변환 : convertToDto
	 */
	private String extractPlaylistUrl(String orderJson) {
		if (orderJson == null) {
			return null;
		}

		ObjectMapper objectMapper = new ObjectMapper();
		try {
			JsonNode orderArray = objectMapper.readTree(orderJson);
			for (JsonNode node : orderArray) {
				if (node.has("order") && node.get("order").asInt() == 0) {
					return node.get("url").asText();
				}
			}
		} catch (JsonProcessingException e) {
			log.error("failed to extract playlist url from order json", e);
			return null; // JSON 파싱 실패 시 null 반환
		}
		return null; // order == 0인 항목이 없는 경우
	}

	private RoomResponseDto convertToDto(Room room) {
		String playlistUrl = null;

		if (room.getPlaylist() != null) {
			playlistUrl = extractPlaylistUrl(room.getPlaylist().getOrder());
		}

		return RoomResponseDto.builder()
			.title(room.getTitle())
			.description(room.getDescription())
			.creator(room.getCreator())
			.userCount(room.getUserCount())
			.playlistUrl(playlistUrl)
			.build();
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

	private Room saveNewRoom(CreateRoomRequestDto requestDto, String creatorNickname, String randomCode) {
		Room newRoom = Room.builder()
			.title(requestDto.getTitle())
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
			.role(0) // 0: creator 역할
			.joinedAt(LocalDateTime.now())
			.build();

		roomUserRepository.save(roomUser);
	}
}
