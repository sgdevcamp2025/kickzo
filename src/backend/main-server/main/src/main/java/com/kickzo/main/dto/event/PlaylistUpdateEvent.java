package com.kickzo.main.dto.event;

import java.util.List;

import com.kickzo.main.dto.data.PlaylistItem;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistUpdateEvent {
	private Long roomId;
	private List<PlaylistItem> playlist;
}
