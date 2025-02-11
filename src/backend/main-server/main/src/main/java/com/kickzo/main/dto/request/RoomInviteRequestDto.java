package com.kickzo.main.dto.request;

import lombok.Getter;

@Getter
public class RoomInviteRequestDto {
	private Long senderId;
	private Long receiverId;
	private Long roomId;
	private String roomCode;
}
