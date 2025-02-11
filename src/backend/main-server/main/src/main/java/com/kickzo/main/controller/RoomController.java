package com.kickzo.main.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.request.RoleChangeRequestDto;
import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.dto.response.UserListDto;
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
public class RoomController implements RoomApi {

	private final RoomService roomService;
	private final PlaylistService playlistService;
	private final RoomUserService roomUserService;

	/**
	 * 방 입장 로직 (WebSocket + STOMP)
	 * @param userId, roomCode
	 * @return RoomEntryResponseDto (방 정보, 유저 리스트, 역할 등)
	 */
	@Override
	@PostMapping("/join")
	public ResponseEntity<RoomEntryResponseDto> joinRoom(
		@RequestHeader(value = "x-user-id", required = false) Long userId,
		@RequestParam String roomCode) {
		log.info("UserId = {}, RoomCode = {}", userId, roomCode);

		RoomEntryResponseDto response = roomService.getRoomJoinResponse(roomCode, userId);
		return ResponseEntity.ok(response);
	}

	@Override
	@PostMapping("/update")
	public ResponseEntity<?> updateRoomInfo(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@Valid @RequestBody RoomUpdateRequestDto requestDto) {
		roomUserService.checkAccessRole(userId, requestDto.getRoomId());
		roomService.updateRoomInfo(requestDto);
		return ResponseEntity.ok("Room updated successfully");
	}

	@Override
	@PostMapping("/playlist")
	public ResponseEntity<String> savePlaylist(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@RequestParam Long roomId,
		@RequestBody String playlistJson) {
		log.info("Saving playlist for room: {}, playlist: {}", roomId, playlistJson);
		roomUserService.checkAccessRole(userId, roomId);
		playlistService.savePlaylist(roomId, playlistJson);
		return ResponseEntity.ok("Playlist saved successfully");
	}

	@Override
	@PatchMapping("/change-role")
	public ResponseEntity<String> changeUserRole(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@RequestBody RoleChangeRequestDto roleChangeRequestDto) {
		roomUserService.changeUserRole(userId, roleChangeRequestDto);
		return ResponseEntity.ok("User role updated successfully.");
	}

	@Override
	@GetMapping("/participants")
	public ResponseEntity<List<UserListDto>> getRoomParticipants(
		@RequestParam Long roomId) {
		return ResponseEntity.ok(roomService.getRoomParticipants(roomId));
	}
}
