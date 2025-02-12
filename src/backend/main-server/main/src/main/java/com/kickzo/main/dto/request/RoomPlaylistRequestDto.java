package com.kickzo.main.dto.request;

import java.util.List;

import com.kickzo.main.dto.data.PlaylistItem;

import lombok.Data;

@Data
public class RoomPlaylistRequestDto {
	private Long roomId;
	private List<PlaylistItem> playlistJson;
}
