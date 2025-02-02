package com.kickzo.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.RoomDetailsDto;
import com.kickzo.main.dto.RoomEntryResponseDto;
import com.kickzo.main.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;

	/**
	 * 방 입장 로직 (WebSocket + STOMP)
	 * @param userId, roomCode
	 * @return RoomEntryResponseDto (방 정보, 유저 리스트, 역할 등)
	 */
	@PostMapping("/v1/join")
	public ResponseEntity<RoomEntryResponseDto> joinRoom(@RequestParam Long userId, @RequestParam String roomCode) {
		// 추후 jwt 토큰에서 userId 분해

		int myRole;
		if (userId == null) {
			// 비로그인 유저는 role = 99
			myRole = 99;
		} else {
			// 유저의 Role 및 방 참여 상태 확인
			myRole = roomService.getUserRole(roomCode, userId);
			System.out.println("myRole: " + myRole);
		}

		RoomDetailsDto roomDetails = roomService.getRoomDetails(roomCode);

		RoomEntryResponseDto response = new RoomEntryResponseDto(myRole, roomDetails);
		return ResponseEntity.ok(response);
	}
}
