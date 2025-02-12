package com.kickzo.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.request.RoomInviteRequestDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.service.InvitationService;
import com.kickzo.main.service.RoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/rooms/invitations")
@RequiredArgsConstructor
public class InvitationController {
	private final RoomService roomService;
	private final InvitationService invitationService;

	@PostMapping()
	public ResponseEntity<?> sendInvitation(
		@RequestHeader(value = "x-user-id") Long senderId,
		@RequestBody RoomInviteRequestDto inviteRequestDto) {
		invitationService.saveInvitation(inviteRequestDto);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/accept")
	public ResponseEntity<RoomEntryResponseDto> acceptInvitation(
		@RequestHeader(value = "x-user-id") Long receiverId,
		@RequestBody RoomInviteRequestDto inviteRequestDto) {
		invitationService.acceptInvitation(inviteRequestDto);
		RoomEntryResponseDto response = roomService.getRoomJoinResponse(inviteRequestDto.getRoomCode(), receiverId);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/reject")
	public ResponseEntity<?> rejectInvitation(
		@RequestHeader(value = "x-user-id") Long receiverId,
		@RequestParam Long senderId,
		@RequestParam Long roomId) {
		invitationService.rejectInvitation(senderId, receiverId, roomId);
		return ResponseEntity.ok().build();
	}
}
