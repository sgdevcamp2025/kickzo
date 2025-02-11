package com.kickzo.main.dto.request;

import lombok.Data;

@Data
public class RoomPlaylistRequestDto {
	private Long roomId;
	private String playlistJson;
}
