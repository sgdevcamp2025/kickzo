package com.kickzo.main;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import com.kickzo.main.dto.response.RoomResponseDto;
import com.kickzo.main.entity.Room;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.service.MainPageService;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class RoomSearchController {

	private final RoomSearchRepository roomSearchRepository;
	private final RoomRepository roomRepository;
	private final MainPageService mainPageService;

	@GetMapping
	public List<RoomResponseDto> searchRooms(@RequestParam String keyword) {
		// Elasticsearch에서 검색된 방 목록 가져오기
		List<RoomDocument> searchResults = roomSearchRepository.findByTitleContainingOrCreatorContaining(keyword,
			keyword);

		// 검색된 방의 roomId 목록 추출
		List<Long> roomIds = searchResults.stream()
			.map(RoomDocument::getRoomId)
			.collect(Collectors.toList());

		// 검색된 방 ID를 기반으로 실제 Room 정보를 가져오기
		List<Room> rooms = roomRepository.findByIdIn(roomIds);

		// Room 엔티티를 RoomResponseDto로 변환하여 반환
		return rooms.stream()
			.map(mainPageService::convertToDto)
			.collect(Collectors.toList());
	}
}
