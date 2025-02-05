package com.kickzo.main.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomEvent {
	private String eventType;  // 이벤트 구분
	private Object data;       // 이벤트 데이터
}
