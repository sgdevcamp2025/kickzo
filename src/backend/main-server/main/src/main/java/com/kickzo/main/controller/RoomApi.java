package com.kickzo.main.controller;

import java.util.List;

import com.kickzo.main.constants.ApiResponseConstants;
import com.kickzo.main.dto.request.RoleChangeRequestDto;
import com.kickzo.main.dto.request.RoomJoinRequestDto;
import com.kickzo.main.dto.request.RoomUpdateRequestDto;
import com.kickzo.main.dto.response.RoomEntryResponseDto;
import com.kickzo.main.dto.response.UserListDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name= "Room", description = "Room 관련 API")
public interface RoomApi {

	@Operation(summary = "방 입장", description = "특정 방에 입장")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "User successfully joined the room"),
		@ApiResponse(responseCode = "MAIN-400-002", description = ApiResponseConstants.INVALID_ROOM_CODE_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-001", description = ApiResponseConstants.ROOM_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "DB-400-001", description = ApiResponseConstants.FOREIGN_KEY_VIOLATION_MESSAGE),
		@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
		@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-001", description = ApiResponseConstants.KAFKA_MESSAGE_SEND_FAILED_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-003", description = ApiResponseConstants.KAFKA_INTERNAL_SERVER_ERROR),
		@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<RoomEntryResponseDto> joinRoom(
		@RequestHeader(value = "x-user-id", required = false) Long userId,
		@RequestBody RoomJoinRequestDto roomJoinRequestDto
	);

	@Operation(summary = "방 정보 수정", description = "특정 방의 제목, 설명, 공개여부를 수정합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Room updated successfully"),
		@ApiResponse(responseCode = "MAIN-400-001", description = ApiResponseConstants.INVALID_INPUT_MESSAGE),
		@ApiResponse(responseCode = "MAIN-400-003", description = ApiResponseConstants.REQUIRED_UPDATE_FIELDS_MISSING_MESSAGE),
		@ApiResponse(responseCode = "MAIN-401-001", description = ApiResponseConstants.INVALID_ACCESS_ROLE_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-001", description = ApiResponseConstants.ROOM_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-002", description = ApiResponseConstants.USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-003", description = ApiResponseConstants.ROOM_USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "DB-400-001", description = ApiResponseConstants.FOREIGN_KEY_VIOLATION_MESSAGE),
		@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
		@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-001", description = ApiResponseConstants.KAFKA_MESSAGE_SEND_FAILED_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-003", description = ApiResponseConstants.KAFKA_INTERNAL_SERVER_ERROR),
		@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<?> updateRoomInfo(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@RequestBody RoomUpdateRequestDto requestDto
	);

	@Operation(summary = "playlist 추가 및 변경사항 저장", description = "특정 방의 playlist를 저장합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "Playlist saved successfully"),
		@ApiResponse(responseCode = "MAIN-400-001", description = ApiResponseConstants.INVALID_INPUT_MESSAGE),
		@ApiResponse(responseCode = "MAIN-400-004", description = ApiResponseConstants.INVALID_PLAYLIST_MESSAGE),
		@ApiResponse(responseCode = "MAIN-401-001", description = ApiResponseConstants.INVALID_ACCESS_ROLE_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-001", description = ApiResponseConstants.ROOM_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-002", description = ApiResponseConstants.USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-003", description = ApiResponseConstants.ROOM_USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "DB-400-001", description = ApiResponseConstants.FOREIGN_KEY_VIOLATION_MESSAGE),
		@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
		@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-001", description = ApiResponseConstants.KAFKA_MESSAGE_SEND_FAILED_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-003", description = ApiResponseConstants.KAFKA_INTERNAL_SERVER_ERROR),
		@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<String> savePlaylist(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@RequestBody Long roomId,
		@RequestBody String playlistJson
	);

	@Operation(summary = "role 변경", description = "특정 방에 권한 있는 사용자가 tragetId의 role을 변경합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "User role updated successfully"),
		@ApiResponse(responseCode = "MAIN-400-001", description = ApiResponseConstants.INVALID_INPUT_MESSAGE),
		@ApiResponse(responseCode = "MAIN-401-001", description = ApiResponseConstants.INVALID_ACCESS_ROLE_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-001", description = ApiResponseConstants.ROOM_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-003", description = ApiResponseConstants.USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-003", description = ApiResponseConstants.ROOM_USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "DB-400-001", description = ApiResponseConstants.FOREIGN_KEY_VIOLATION_MESSAGE),
		@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
		@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-001", description = ApiResponseConstants.KAFKA_MESSAGE_SEND_FAILED_MESSAGE),
		@ApiResponse(responseCode = "KAFKA-500-003", description = ApiResponseConstants.KAFKA_INTERNAL_SERVER_ERROR),
		@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<String> changeUserRole(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@RequestBody RoleChangeRequestDto roleChangeRequestDto
	);

	@Operation(summary = "방의 userList 제공", description = "방에 소속한 participant의 userList를 제공합니다.")
	ResponseEntity<List<UserListDto>> getRoomParticipants(
		@RequestParam Long roomId
	);
}
