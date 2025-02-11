package com.kickzo.main.dto.data;

import com.kickzo.main.enums.InvitationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvitationData {
	private String type;
	private Long senderId;
	private String senderNickname;
	private Long receiverId;
	private String receiverNickname;
	private String timestamp;
	private Long roomId;
	private String roomCode;
	private String isRead;
	private InvitationStatus status;
}
