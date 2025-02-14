package kickzo.stomp_chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomEvent {
	// TODO[SMG-C]: enum 사용 지향
	// string 보다는 enum 사용하시면 switch case 문 쓸 때도 편해요
	private String eventType;  // 이벤트 구분
	private Object data;       // 이벤트 데이터

	@Override
	public String toString() {
		return "RoomEvent{eventType='" + eventType + "', data=" + data + "}";
	}
}
