package com.kickzo.main.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleChangeRequestDto {
	private Long roomId;
	private Long targetUserId;
	private int newRole;
}
