package kickzo.stomp_chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

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
	private String status;
}
