package com.kickzo.main.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RoomRole {
	CREATOR(0),
	MANAGER(1),
	MEMBER(2);

	private final int value;
}
