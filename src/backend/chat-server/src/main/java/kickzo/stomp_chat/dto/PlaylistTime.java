package kickzo.stomp_chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistTime {
	private long roomId;
	private long playlistTime;
}
