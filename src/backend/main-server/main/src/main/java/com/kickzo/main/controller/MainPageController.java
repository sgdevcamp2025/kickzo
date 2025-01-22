package com.kickzo.main.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.CreateRoomRequestDto;
import com.kickzo.main.dto.RoomResponseDto;
import com.kickzo.main.service.MainPageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class MainPageController {

	private final MainPageService mainPageService;

	@GetMapping("/v1/list")
	public ResponseEntity<List<RoomResponseDto>> getAllRooms(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {
		log.info("get all rooms. page: {}, size: {}", page, size);
		Pageable pageable = PageRequest.of(page, size);
		List<RoomResponseDto> rooms = mainPageService.getAllRooms(pageable);
		return ResponseEntity.ok(rooms);
	}

	// 추후 jwt 토큰 확인 작업 & userId 추출 작업 필요
	@GetMapping("/v1/list/my")
	public ResponseEntity<List<RoomResponseDto>> getUserRooms(@RequestParam Long userId) {
		log.info("get user rooms. userId: {}", userId);
		List<RoomResponseDto> rooms = mainPageService.getUserRooms(userId);
		return ResponseEntity.ok(rooms);
	}

	@PostMapping("/v1/create-room")
	public ResponseEntity<String> createRoom(
		@RequestParam Long userId,
		@RequestParam String creatorNickname,
		@RequestBody CreateRoomRequestDto requestDto) {
		log.info("create room. userId: {}, creatorNickname: {}", userId, creatorNickname);
		String roomCode = mainPageService.createRoom(userId, creatorNickname, requestDto);
		return ResponseEntity.ok(roomCode);
	}
}
