package com.kickzo.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.main.dto.request.RoomInviteRequestDto;
import com.kickzo.main.service.InvitationService;
import com.kickzo.main.service.RoomQueryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/rooms/invitations")
@RequiredArgsConstructor
public class InvitationController {
	private final RoomQueryService roomQueryService;
	private final InvitationService invitationService;

	@PostMapping()
	public ResponseEntity<String> sendInvitation(
		@RequestHeader(value = "x-user-id") Long senderId,
		@RequestBody RoomInviteRequestDto inviteRequestDto) {
		invitationService.sendInvitation(senderId, inviteRequestDto);
		return ResponseEntity.ok("Invitation sent");
	}

	@PostMapping("/accept")
	public ResponseEntity<String> acceptInvitation(
		@RequestHeader(value = "x-user-id") Long receiverId,
		@RequestBody RoomInviteRequestDto inviteRequestDto) {
		invitationService.acceptInvitation(receiverId, inviteRequestDto);
		roomQueryService.getRoomJoinResponse(inviteRequestDto.getRoomCode(), receiverId);
		return ResponseEntity.ok("Invitation accepted");
	}

	@PostMapping("/reject")
	public ResponseEntity<String> rejectInvitation(
		@RequestHeader(value = "x-user-id") Long receiverId,
		@RequestBody RoomInviteRequestDto inviteRequestDto) {
		invitationService.rejectInvitation(receiverId, inviteRequestDto);
		return ResponseEntity.ok("Invitation rejected");
	}
}
