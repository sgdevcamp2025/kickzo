package com.kickzo.main.dto.response;

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
	private Long roomId;
	private String code;
	private String title;
	private String description;
	private boolean isPublic;
	private String creator;
	private String profileImageUrl;
	private int userCount;
	private String playlistUrl;
}

