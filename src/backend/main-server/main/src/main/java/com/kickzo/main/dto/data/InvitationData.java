package com.kickzo.main.dto.data;

import com.fasterxml.jackson.annotation.JsonProperty;
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
	private Long timestamp;
	private Long roomId;
	private String roomCode;
	@JsonProperty("isRead")
	private boolean isRead;
	private InvitationStatus status;
}
