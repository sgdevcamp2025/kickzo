package kickzo.stomp_chat.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoleChangeEvent {
	private Long roomId;
	private Long targetUserId;
	private int newRole;
}
