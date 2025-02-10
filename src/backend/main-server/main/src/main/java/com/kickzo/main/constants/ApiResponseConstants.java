package com.kickzo.main.constants;

public class ApiResponseConstants {

	// Main error messages
	public static final String INVALID_ACCESS_ROLE_MESSAGE = "수정 권한이 없는 유저입니다.";
	public static final String INVALID_INPUT_MESSAGE = "잘못된 입력입니다.";
	public static final String INVALID_ROOM_CODE_MESSAGE = "유효하지 않은 방 코드입니다.";
	public static final String REQUIRED_UPDATE_FIELDS_MISSING_MESSAGE = "적어도 하나의 변경할 값을 입력해야 합니다.";
	public static final String INVALID_PLAYLIST_MESSAGE = "Playlist의 roomId가 null입니다.";
	public static final String ROOM_LIMIT_EXCEEDED_MESSAGE = "최대 5개의 방만 생성할 수 있습니다.";
	public static final String ROOM_NOT_FOUND_MESSAGE = "해당 방을 찾을 수 없습니다.";
	public static final String USER_NOT_FOUND_MESSAGE = "사용자를 찾을 수 없습니다.";
	public static final String ROOM_USER_NOT_FOUND_MESSAGE = "방-사용자를 찾을 수 없습니다.";
	//public static final String PLAYLIST_NOT_FOUND_MESSAGE = "플레이리스트를 찾을 수 없습니다.";

	// Database error messages
	public static final String FOREIGN_KEY_VIOLATION_MESSAGE = "참조하는 데이터가 존재하지 않습니다.";
	public static final String DATABASE_ERROR_MESSAGE = "데이터베이스 오류가 발생했습니다.";

	// Kafka error messages
	public static final String KAFKA_MESSAGE_SEND_FAILED_MESSAGE = "Kafka 메시지 전송에 실패하였습니다.";
	//public static final String KAFKA_BROKER_NOT_AVAILABLE_MESSAGE = "Kafka 브로커가 응답하지 않습니다.";
	public static final String KAFKA_INTERNAL_SERVER_ERROR = "Kafka 처리 중 알 수 없는 오류가 발생했습니다.";
	//public static final String KAFKA_TOPIC_NOT_FOUND_MESSAGE = "해당 Kafka 토픽을 찾을 수 없습니다.";


	// JSON error messages
	public static final String JSON_PROCESSING_ERROR_MESSAGE = "JSON 직렬화 중 오류가 발생하였습니다.";

	// Unexpected error
	public static final String UNEXPECTED_ERROR_MESSAGE = "예상치 못한 오류가 발생했습니다.";
}
