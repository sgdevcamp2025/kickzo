package com.kickzo.main.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<CustomErrorResponse> handleCustomException(CustomException ex) {
		log.error("CustomException 발생: 코드={}, 메시지={}", ex.getErrorCode(), ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			ex.getErrorCode().getCode(),
			ex.getErrorCode().getMessage()
		);

		return ResponseEntity.status(ex.getErrorCode().getHttpStatus()).body(errorResponse);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<CustomErrorResponse> handleGeneralException(Exception ex) {
		log.error("Unhandled Exception 발생: {}", ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.UNEXPECTED_ERROR.getCode(),
			CustomErrorCode.UNEXPECTED_ERROR.getMessage()
		);

		return ResponseEntity.status(CustomErrorCode.UNEXPECTED_ERROR.getHttpStatus()).body(errorResponse);
	}

	// request에서 발생한 오류
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<CustomErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
		log.error("잘못된 요청 발생: {}", ex.getMessage());

		String errorMessage = ex.getBindingResult().getFieldErrors().stream()
			.findFirst() // 첫 번째 오류만 가져옴
			.map(error -> error.getDefaultMessage())
			.orElse("잘못된 입력입니다."); // 예외적으로 오류가 없을 경우 기본 메시지

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.INVALID_INPUT.getCode(),
			errorMessage
		);

		return ResponseEntity.status(CustomErrorCode.INVALID_INPUT.getHttpStatus()).body(errorResponse);
	}
}
