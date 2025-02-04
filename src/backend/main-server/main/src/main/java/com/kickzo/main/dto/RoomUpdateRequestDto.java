package com.kickzo.main.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class RoomUpdateRequestDto {
	@NotNull(message = "방 변경을 위한 roomId을 입력해주세요.")
	private Long id;
	@Size(max = 60, message = "방 제목은 60자 이하여야 합니다.")
	private String title;
	private String description;
	private Boolean isPublic;
}
