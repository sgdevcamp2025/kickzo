package com.kickzo.main.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CustomErrorCode {
	ROOM_LIMIT_EXCEEDED("MAIN-403-001", "최대 5개의 방만 생성할 수 있습니다.", HttpStatus.FORBIDDEN),
	INVALID_ACCESS_TOKEN("MAIN-401-001", "유효하지 않은 AccessToken 입니다.", HttpStatus.UNAUTHORIZED),
	INVALID_ACCESS_ROLE("MAIN-401-002", "수정 권한이 없는 유저입니다.", HttpStatus.UNAUTHORIZED),
	INVALID_INPUT("MAIN-400-001", "잘못된 입력입니다.", HttpStatus.BAD_REQUEST),
	INVALID_ROOM_CODE("MAIN-400-002", "유효하지 않은 방 코드입니다.", HttpStatus.BAD_REQUEST),
	REQUIRED_UPDATE_FIELDS_MISSING("MAIN-400-003", "적어도 하나의 변경할 값을 입력해야 합니다.", HttpStatus.BAD_REQUEST),
	ROOM_NOT_FOUND("MAIN-404-001", "해당 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	USER_NOT_FOUND("MAIN-404-002", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	PLAYLIST_NOT_FOUND("MAIN-404-003", "플레이리스트를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	ROOM_USER_SAVE_FAILED("MAIN-500-002", "방 사용자 정보를 저장하는 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	INVALID_PLAYLIST("MAIN-404-003", "Playlist의 roomId가 null입니다.", HttpStatus.BAD_REQUEST),
	FOREIGN_KEY_VIOLATION("DB-400-001", "참조하는 데이터가 존재하지 않습니다.", HttpStatus.BAD_REQUEST),
	DATABASE_ERROR("DB-500-001", "데이터베이스 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	KAFKA_MESSAGE_SEND_FAILED("KAFKA-500-001", "Kafka 메시지 전송에 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	KAFKA_BROKER_NOT_AVAILABLE("KAFKA-500-002", "Kafka 브로커가 응답하지 않습니다.", HttpStatus.SERVICE_UNAVAILABLE),
	KAFKA_TOPIC_NOT_FOUND("KAFKA-404-001", "해당 Kafka 토픽을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),

	JSON_PROCESSING_ERROR("JSON-500-001", "JSON 직렬화 중 오류가 발생하였습니다.", HttpStatus.BAD_REQUEST),

	UNEXPECTED_ERROR("MAIN-500-999", "예상치 못한 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

	private final String code;
	private final String message;
	private final HttpStatus status;
}
