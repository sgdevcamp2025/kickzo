package com.kickzo.main;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class User {
	private final Long userId;
	private final String nickname;
	private final String stateMessage;
	private final String profileImageUrl;

}
