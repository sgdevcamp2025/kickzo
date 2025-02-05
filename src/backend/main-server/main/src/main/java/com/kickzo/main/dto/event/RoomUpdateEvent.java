package com.kickzo.main.dto.event;

import com.kickzo.main.dto.request.RoomUpdateRequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomUpdateEvent {
	private Long roomId;
	private String title;
	private String description;
	private Boolean isPublic;

	public RoomUpdateEvent(Long roomId) {
		this.roomId = roomId;
		this.title = null;
		this.description = null;
		this.isPublic = null;
	}

	public void setUpdatedFields(RoomUpdateRequestDto requestDto) {
		if (requestDto.getTitle() != null) {
			this.title = requestDto.getTitle();
		}
		if (requestDto.getDescription() != null) {
			this.description = requestDto.getDescription();
		}
		if (requestDto.getIsPublic() != null) {
			this.isPublic = requestDto.getIsPublic();
		}
	}
}
