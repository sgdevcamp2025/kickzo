package kickzo.stomp_chat.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaylistUpdateEvent {
	private Long roomId;
	private String playlistJson;
}
