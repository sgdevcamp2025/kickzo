package com.kickzo.main.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaProducerException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.core.JsonProcessingException;

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

	@ExceptionHandler(DataAccessException.class)
	public ResponseEntity<CustomErrorResponse> handleDatabaseException(DataAccessException ex) {
		log.error("DataBase 오류 발생: {}", ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.DATABASE_ERROR.getCode(),
			CustomErrorCode.DATABASE_ERROR.getMessage()
		);

		return ResponseEntity.status(CustomErrorCode.DATABASE_ERROR.getHttpStatus()).body(errorResponse);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<CustomErrorResponse> handleDataIntegrityException(DataIntegrityViolationException ex) {
		log.error("데이터 무결성 위반: {}", ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.FOREIGN_KEY_VIOLATION.getCode(),
			CustomErrorCode.FOREIGN_KEY_VIOLATION.getMessage()
		);

		return ResponseEntity.status(CustomErrorCode.FOREIGN_KEY_VIOLATION.getHttpStatus()).body(errorResponse);
	}

	@ExceptionHandler(JsonProcessingException.class)
	public ResponseEntity<CustomErrorResponse> handleJsonProcessingException(JsonProcessingException ex) {
		log.error("JSON 처리시 오류 발생: {}", ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.JSON_PROCESSING_ERROR.getCode(),
			CustomErrorCode.JSON_PROCESSING_ERROR.getMessage()
		);

		return ResponseEntity.status(CustomErrorCode.JSON_PROCESSING_ERROR.getHttpStatus()).body(errorResponse);
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

	@ExceptionHandler(KafkaProducerException.class)
	public ResponseEntity<CustomErrorResponse> handleKafkaProducerException(KafkaProducerException ex) {
		log.error("Kafka Producer 오류: {}", ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED.getCode(),
			CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED.getMessage()
		);

		return ResponseEntity.status(CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED.getHttpStatus()).body(errorResponse);
	}

	@ExceptionHandler(KafkaException.class)
	public ResponseEntity<CustomErrorResponse> handleKafkaException(KafkaException ex) {
		log.error("Kafka 오류: {}", ex.getMessage());

		CustomErrorResponse errorResponse = new CustomErrorResponse(
			CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED.getCode(),
			CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED.getMessage()
		);

		return ResponseEntity.status(CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED.getHttpStatus()).body(errorResponse);
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
