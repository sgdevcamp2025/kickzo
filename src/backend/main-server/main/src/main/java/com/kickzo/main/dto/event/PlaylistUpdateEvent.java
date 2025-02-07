package com.kickzo.main.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaylistUpdateEvent {
	private Long roomId;
	private String playlistJson;
}
