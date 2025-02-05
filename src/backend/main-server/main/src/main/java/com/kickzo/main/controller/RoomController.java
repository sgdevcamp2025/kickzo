package com.kickzo.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.dto.response.RoomDetailsDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.service.PlaylistService;
import com.kickzo.main.service.RoomService;
import com.kickzo.main.service.RoomUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;
	private final PlaylistService playlistService;
	private final RoomUserService roomUserService;

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

	/**
	 * 방 Info(제목 or 설명 or 공개여부) 변경
	 * @param userId, requestDto
	 */
	@PostMapping("/v1/update")
	public ResponseEntity<?> updateRoomInfo(@RequestParam Long userId,
		@Valid @RequestBody RoomUpdateRequestDto requestDto) {
		// 유효한 accestoken 여부 검증 로직
		roomService.updateRoomInfo(requestDto);
		return ResponseEntity.ok("Room updated successfully");
	}

	@PostMapping("/v1/playlist")
	public ResponseEntity<String> savePlaylist(
		@RequestParam Long userId,
		@RequestParam Long roomId,
		@RequestBody String playlistJson) {
		// 유효한 accestoken 여부 검증 로직
		log.info("Saving playlist for room: {}", roomId);
		log.info("Playlist: {}", playlistJson);

		playlistService.savePlaylist(roomId, playlistJson);

		return ResponseEntity.ok("Playlist saved successfully");
	}

	@PatchMapping("/v1/change-role")
	public ResponseEntity<String> changeUserRole(
		@RequestParam Long userId,
		@RequestParam Long roomId,
		@RequestParam Long targetUserId,
		@RequestParam int newRole) {

		roomUserService.changeUserRole(userId, roomId, targetUserId, newRole);
		return ResponseEntity.ok("User role updated successfully.");
	}
}
