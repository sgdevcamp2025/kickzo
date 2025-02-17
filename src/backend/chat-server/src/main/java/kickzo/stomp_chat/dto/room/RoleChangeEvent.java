package kickzo.stomp_chat.dto.room;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RoleChangeEvent {
	private Long roomId;
	private Long targetUserId;
	private int newRole;
}
