package kickzo.stomp_chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoleChangeEvent {
	private Long roomId;
	private Long targetUserId;
	private int newRole;
}
