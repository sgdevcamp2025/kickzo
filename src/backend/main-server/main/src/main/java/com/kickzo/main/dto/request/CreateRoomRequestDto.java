package com.kickzo.main.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomRequestDto {

	@NotBlank(message = "방 생성자 이름을 입력해주세요.")
	private String creator;
	@NotBlank(message = "방 제목을 입력해주세요.")
	@Size(max = 60, message = "방 제목은 60자 이하여야 합니다.")
	private String title;
	private String description;
	@NotNull(message = "방 공개 여부 설정을 입력해주세요.")
	private Boolean isPublic;
}
