package com.kickzo.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class RoomInfoDto {
	private Long roomId;
	private String title;
	private String description;
	private int userCount;
	private String creator;
}
