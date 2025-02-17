package kickzo.stomp_chat.dto.playlist;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlayTime {
	private long roomId;
	private long playTime;
	private String playerState;
}
