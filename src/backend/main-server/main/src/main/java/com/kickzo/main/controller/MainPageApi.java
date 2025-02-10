package com.kickzo.main.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.kickzo.main.constants.ApiResponseConstants;
import com.kickzo.main.dto.request.CreateRoomRequestDto;
import com.kickzo.main.dto.response.CreateRoomResponseDto;
import com.kickzo.main.dto.response.RoomResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name= "MainPage", description = "MainPage 관련 API")
public interface MainPageApi {

	@Operation(summary = "모든 방 조회", description = "페이지 번호와 사이즈로 방 목록을 조회합니다.")
	@ApiResponses(
		value = {
			@ApiResponse(responseCode = "200", description = "전체 방 목록 조회 성공"),
			@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
			@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
			@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<List<RoomResponseDto>> getAllRooms(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	);

	@Operation(summary = "사용자 방 조회", description = "특정 사용자의 방 목록을 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "사용자의 방 조회 성공"),
		@ApiResponse(responseCode = "MAIN-404-002", description = ApiResponseConstants.USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
		@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
		@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<List<RoomResponseDto>> getUserRooms(
		@RequestHeader(value = "x-user-id", required = true) Long userId
	);

	@Operation(summary = "방 생성", description = "사용자가 새로운 방을 생성합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "새로운 방 생성 성공"),
		@ApiResponse(responseCode = "MAIN-400-001", description = ApiResponseConstants.INVALID_INPUT_MESSAGE),
		@ApiResponse(responseCode = "MAIN-404-002", description = ApiResponseConstants.USER_NOT_FOUND_MESSAGE),
		@ApiResponse(responseCode = "MAIN-403-001", description = ApiResponseConstants.ROOM_LIMIT_EXCEEDED_MESSAGE),
		@ApiResponse(responseCode = "DB-400-001", description = ApiResponseConstants.FOREIGN_KEY_VIOLATION_MESSAGE),
		@ApiResponse(responseCode = "DB-500-001", description = ApiResponseConstants.DATABASE_ERROR_MESSAGE),
		@ApiResponse(responseCode = "JSON-500-001", description = ApiResponseConstants.JSON_PROCESSING_ERROR_MESSAGE),
		@ApiResponse(responseCode = "MAIN-500-999", description = ApiResponseConstants.UNEXPECTED_ERROR_MESSAGE)
	})
	ResponseEntity<CreateRoomResponseDto> createRoom(
		@RequestHeader(value = "x-user-id", required = true) Long userId,
		@RequestBody CreateRoomRequestDto requestDto
	);
}

