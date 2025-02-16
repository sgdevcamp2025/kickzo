package kickzo.stomp_chat.dto.user;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusEvent {
	private long userId;
	private String status;
	private List<Long> friends;
	private long timestamp;
}

