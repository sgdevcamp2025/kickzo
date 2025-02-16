package kickzo.stomp_chat.dto.room;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomData {
	private Long roomId;
	private String title;
	private String description;
	private Boolean isPublic;
}
