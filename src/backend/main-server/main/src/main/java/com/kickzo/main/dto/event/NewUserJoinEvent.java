package com.kickzo.main.dto.event;

import java.util.List;

import com.kickzo.main.dto.response.UserListDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NewUserJoinEvent {
	private Long roomId;
	private List<UserListDto> userList;
}
