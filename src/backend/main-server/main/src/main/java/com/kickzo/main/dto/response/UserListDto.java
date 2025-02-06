package com.kickzo.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserListDto {
	private Long userId;
	private int role;
	private String nickname;
}