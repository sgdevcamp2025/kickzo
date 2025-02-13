package com.kickzo.main.dto.event;

import com.kickzo.main.dto.response.UserInfoDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NewUserJoinEvent {
	private Long roomId;
	private UserInfoDto userList;
}
