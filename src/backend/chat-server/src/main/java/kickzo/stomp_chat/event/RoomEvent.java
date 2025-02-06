package kickzo.stomp_chat.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomEvent {
	private String eventType;  // 이벤트 구분
	private Object data;       // 이벤트 데이터

	@Override
	public String toString() {
		return "RoomEvent{eventType='" + eventType + "', data=" + data + "}";
	}
}
