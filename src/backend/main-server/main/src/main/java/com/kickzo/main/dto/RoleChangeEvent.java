package com.kickzo.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoleChangeEvent {
	private Long roomId;
	private Long targetUserId;
	private int newRole;
}
