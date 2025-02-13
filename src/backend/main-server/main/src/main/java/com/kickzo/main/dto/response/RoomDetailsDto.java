package com.kickzo.main.dto.response;

import java.util.List;

import com.kickzo.main.dto.data.PlaylistItem;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDetailsDto {
	private List<UserListDto> userList;
	private List<RoomInfoDto> roomInfo;
	private List<PlaylistItem> playlist;
}