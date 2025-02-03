package com.kickzo.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class RoomInfoDto {
	private Long id;
	private String code;
	private String title;
	private String description;
	private int userCount;
	private String creator;
	private String profileImageUrl;
}
