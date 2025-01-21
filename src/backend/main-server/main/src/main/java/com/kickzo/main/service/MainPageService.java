package com.kickzo.main.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.RoomResponseDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.repository.PlaylistRepository;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.repository.RoomUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
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

	// 방 만들기

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
}
