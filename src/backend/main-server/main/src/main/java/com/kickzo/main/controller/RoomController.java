package com.kickzo.main.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.dto.request.RoleChangeRequestDto;
import com.kickzo.main.dto.request.RoomJoinRequestDto;
import com.kickzo.main.dto.request.RoomPlaylistRequestDto;
import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.dto.response.UserInfoDto;
import com.kickzo.main.service.PlaylistService;
import com.kickzo.main.service.RoomQueryService;
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
	private final RoomQueryService roomQueryService;
	private final PlaylistService playlistService;
	private final RoomUserService roomUserService;

	@Override
	@PostMapping("/join")
	public ResponseEntity<RoomEntryResponseDto> joinRoom(
		@RequestHeader(value = "x-user-id", required = false) Long userId,
		@RequestBody RoomJoinRequestDto roomJoinRequestDto) {
		String roomCode = roomJoinRequestDto.getRoomCode();
		log.info("Join Room : UserId = {}, RoomCode = {}", userId, roomCode);
		roomService.joinRoom(roomCode, userId);
		RoomEntryResponseDto response = roomQueryService.getRoomJoinResponse(roomCode, userId);
		return ResponseEntity.ok(response);
	}

	@Override
	@PostMapping("/update")
	public ResponseEntity<?> updateRoomInfo(
	@RequestHeader(value = "x-user-id") Long userId,
		@Valid @RequestBody RoomUpdateRequestDto requestDto) {
		log.info("Room Update : UserId = {}, RoomCode = {}", userId, requestDto);
		roomUserService.checkAccessRole(userId, requestDto.getRoomId());
		roomService.updateRoomInfo(requestDto);
		return ResponseEntity.ok("Room updated successfully");
	}

	@Override
	@PostMapping("/playlist")
	public ResponseEntity<String> savePlaylist(
		@RequestHeader(value = "x-user-id") Long userId,
		@RequestBody RoomPlaylistRequestDto playlistRequestDto) {
		Long roomId = playlistRequestDto.getRoomId();
		List<PlaylistItem> playlistItems = playlistRequestDto.getPlaylist();
		log.info("Saving playlist for room: {}, playlist: {}", roomId, playlistItems);
		roomUserService.checkAccessRole(userId, roomId);
		playlistService.savePlaylist(roomId, playlistItems);
		return ResponseEntity.ok("Playlist saved successfully");
	}

	@Override
	@PatchMapping("/change-role")
	public ResponseEntity<String> changeUserRole(
		@RequestHeader(value = "x-user-id") Long userId,
		@RequestBody RoleChangeRequestDto roleChangeRequestDto) {
		log.info("Changing user role: {}", roleChangeRequestDto);
		roomUserService.changeUserRole(userId, roleChangeRequestDto);
		return ResponseEntity.ok("User role updated successfully.");
	}

	@Override
	@GetMapping("/participants")
	public ResponseEntity<List<UserInfoDto>> getRoomParticipants(
		@RequestParam Long roomId) {
		return ResponseEntity.ok(roomQueryService.getRoomParticipants(roomId));
	}

	@DeleteMapping("/leave/{roomId}")
	public ResponseEntity<String> userLeaveRoom(
		@RequestHeader(value = "x-user-id") Long userId,
		@PathVariable Long roomId){
		roomService.leaveRoom(roomId, userId);
		return ResponseEntity.ok("Leave room successfully.");
	}

	@DeleteMapping("/delete/{roomId}")
	public ResponseEntity<String> deleteRoom(
		@RequestHeader(value = "x-user-id") Long userId,
		@PathVariable Long roomId){
		roomService.deleteRoom(roomId, userId);
		return ResponseEntity.ok("Room deleted successfully");
	}
}
