package kickzo.stomp_chat.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NewUserJoinEvent {
	private Long roomId;
	private List<UserListDto> userList;
}
