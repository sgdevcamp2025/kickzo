package com.kickzo.main.dto;

import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomUpdateEvent {
	private Long roomId;
	private Map<String, Object> updatedFields;  // 변경된 값만 포함

	public static RoomUpdateEvent from(Long roomId, RoomUpdateRequestDto requestDto) {
		Map<String, Object> updates = new HashMap<>();
		if (requestDto.getTitle() != null) {
			updates.put("title", requestDto.getTitle());
		}
		if (requestDto.getDescription() != null) {
			updates.put("description", requestDto.getDescription());
		}
		if (requestDto.getIsPublic() != null) {
			updates.put("isPublic", requestDto.getIsPublic());
		}
		return new RoomUpdateEvent(roomId, updates);
	}
}