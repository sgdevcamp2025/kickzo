package com.kickzo.main.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CustomErrorCode {
	INVALID_INPUT("MAIN-400-001", "잘못된 입력입니다.", HttpStatus.BAD_REQUEST),
	INVALID_ROOM_CODE("MAIN-400-002", "유효하지 않은 방 코드입니다.", HttpStatus.BAD_REQUEST),
	REQUIRED_UPDATE_FIELDS_MISSING("MAIN-400-003", "적어도 하나의 변경할 값을 입력해야 합니다.", HttpStatus.BAD_REQUEST),
	INVALID_PLAYLIST("MAIN-400-004", "Playlist roomId가 null 입니다.", HttpStatus.BAD_REQUEST),
	INVALID_ROOM ("MAIN-400-005", "roomId와 roomCode가 불일치 합니다.", HttpStatus.BAD_REQUEST),
	INVALID_SENDER ("MAIN-400-006", "userId와 senderId가 불일치 합니다.", HttpStatus.BAD_REQUEST),
	INVALID_RECEIVER ("MAIN-400-007", "userId와 receiverId가 불일치 합니다.", HttpStatus.BAD_REQUEST),

	INVALID_ACCESS_ROLE("MAIN-401-001", "수정 권한이 없는 유저입니다.", HttpStatus.UNAUTHORIZED),

	ROOM_LIMIT_EXCEEDED("MAIN-403-001", "최대 5개의 방만 생성할 수 있습니다.", HttpStatus.FORBIDDEN),

	ROOM_NOT_FOUND("MAIN-404-001", "해당 방을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	USER_NOT_FOUND("MAIN-404-002", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	ROOM_USER_NOT_FOUND("MAIN-404-003", "방-사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	//PLAYLIST_NOT_FOUND("MAIN-404-004", "플레이리스트를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	INVITATION_NOT_FOUND("MAIN-404-005", "초대 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	SENDER_NOT_FOUND("MAIN-404-006", "요청 보낸 사용자가 방에 소속되어 있지 않습니다.", HttpStatus.NOT_FOUND),

	DUPLICATE_INVITATION("MAIN-409-001", "이미 초대가 진행 중입니다.", HttpStatus.CONFLICT),
	INVITATION_REJECTED("MAIN-409-002", "이 초대는 이미 거절되었습니다.", HttpStatus.CONFLICT),
	EXISTING_ROOM_USER("MAIN-409-003", "유저가 해당 방에 이미 소속되어 있습니다.", HttpStatus.CONFLICT),

	FAILED_CREATE_INVITATION("MAIN-422-001", "초대 상태를 업데이트하는 중 오류가 발생했습니다.", HttpStatus.UNPROCESSABLE_ENTITY),

	FOREIGN_KEY_VIOLATION("DB-400-001", "참조하는 데이터가 존재하지 않습니다.", HttpStatus.BAD_REQUEST),
	DATABASE_ERROR("DB-500-001", "데이터베이스 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	KAFKA_MESSAGE_SEND_FAILED("KAFKA-500-001", "Kafka 메시지 전송에 실패하였습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	//KAFKA_BROKER_NOT_AVAILABLE("KAFKA-500-002", "Kafka 브로커가 응답하지 않습니다.", HttpStatus.SERVICE_UNAVAILABLE),
	KAFKA_INTERNAL_SERVER_ERROR("KAFKA-500-003", "Kafka 처리 중 알 수 없는 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	//KAFKA_TOPIC_NOT_FOUND("KAFKA-404-001", "해당 Kafka 토픽을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),

	JSON_PROCESSING_ERROR("JSON-500-001", "JSON 직렬화 중 오류가 발생하였습니다.", HttpStatus.BAD_REQUEST),

	FAILED_INVITE_STATUS_UPDATE("MAIN-500-001", "초대 상태 업데이트에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	UNEXPECTED_ERROR("MAIN-500-999", "예상치 못한 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;
}
