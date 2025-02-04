package com.kickzo.main.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDetailsDto {
	private List<UserListDto> userList;
	private List<RoomInfoDto> roomInfo;
	private List<PlaylistDto> playlist;
}