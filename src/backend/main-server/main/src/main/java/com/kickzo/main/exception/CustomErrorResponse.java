package com.kickzo.main.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CustomErrorResponse {
	private String errorCode;
	private String message;

	public CustomErrorResponse(String code, String message) {
		this.errorCode = code;
		this.message = message;
	}
}
