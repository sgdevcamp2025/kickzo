package com.kickzo.main.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.request.CreateRoomRequestDto;
import com.kickzo.main.dto.response.CreateRoomResponseDto;
import com.kickzo.main.dto.response.RoomResponseDto;
import com.kickzo.main.service.MainPageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class MainPageController implements MainPageApi {

	private final MainPageService mainPageService;

	@Override
	@GetMapping("/all")
	public ResponseEntity<List<RoomResponseDto>> getAllRooms(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {
		log.info("get all rooms. page: {}, size: {}", page, size);
		return ResponseEntity.ok(mainPageService.getAllRooms(PageRequest.of(page, size)));
	}

	@Override
	@GetMapping("/me")
	public ResponseEntity<List<RoomResponseDto>> getUserRooms(
		@RequestHeader(value = "x-user-id") Long userId) {
		log.info("get user rooms. userId: {}", userId);
		return ResponseEntity.ok(mainPageService.getUserRooms(userId));
	}

	@Override
	@PostMapping("/create-room")
	public ResponseEntity<CreateRoomResponseDto> createRoom(
		@RequestHeader(value = "x-user-id") Long userId,
		@Valid @RequestBody CreateRoomRequestDto requestDto) {
		log.info("create room for userId: {}", userId);
		return ResponseEntity.ok(mainPageService.createRoom(userId, requestDto));
	}
}
