package com.kickzo.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserListDto {
	private Long userId;
	private int role;
	private String nickname;
}