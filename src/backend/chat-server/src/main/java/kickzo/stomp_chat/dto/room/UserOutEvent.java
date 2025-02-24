package kickzo.stomp_chat.dto.room;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserOutEvent {
	private long roomId;
	private long userId;
}
