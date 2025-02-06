package com.kickzo.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomEntryResponseDto {
	private int myRole;
	private RoomDetailsDto roomDetails;
}
