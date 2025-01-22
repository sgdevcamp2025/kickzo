package com.kickzo.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomResponseDto {
	private String title;
	private String description;
	private String creator;
	private int userCount;
	private String playlistUrl;
}

