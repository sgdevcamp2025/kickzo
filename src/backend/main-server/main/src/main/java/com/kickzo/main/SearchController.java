package com.kickzo.main;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.kickzo.main.dto.response.RoomResponseDto;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.service.MainPageService;

@Slf4j
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

	private final RoomSearchRepository roomSearchRepository;
	private final RoomRepository roomRepository;
	private final UserSearchRepository userSearchRepository;
	private final MainPageService mainPageService;

	@GetMapping
	public Map<String, Object> searchRoomsAndUsers(@RequestParam String keyword) {
		Map<String, Object> result = new HashMap<>();
		result.put("rooms", convertToRoomDto(keyword));
		result.put("users", convertToUserDto(keyword));
		return result;
	}

	private List<RoomResponseDto> convertToRoomDto(String keyword) {
		return roomRepository.findByIdIn(
			roomSearchRepository.findByTitleContainingAndIsPublic(keyword, true)
			.stream()
			.map(RoomDocument::getRoomId)
			.collect(Collectors.toList())
		).stream().map(mainPageService::convertToDto)
			.collect(Collectors.toList());
	}

	private List<UserResponseDto> convertToUserDto(String keyword) {
		return userSearchRepository.findByNicknameContaining(keyword)
			.stream()
			.map(user -> new UserResponseDto(
				user.getUserId(),
				user.getNickname(),
				user.getStateMessage(),
				user.getProfileImageUrl()
			))
			.toList();
	}

	public record UserResponseDto(Long userId, String nickname, String stateMessage, String profileImageUrl) {}
}
