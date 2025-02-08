package com.kickzo.main.dto.event;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistUpdateEvent {
	private Long roomId;
	private List<PlaylistItem> playlistJson;
}
