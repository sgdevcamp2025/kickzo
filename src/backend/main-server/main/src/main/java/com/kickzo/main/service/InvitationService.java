package com.kickzo.main.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.data.InvitationData;
import com.kickzo.main.dto.request.RoomInviteRequestDto;
import com.kickzo.main.enums.InvitationStatus;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;
import com.kickzo.main.repository.RoomRepository;
import com.kickzo.main.repository.RoomUserRepository;
import com.kickzo.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvitationService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final UserRepository userRepository;
	private final KafkaProducerService kafkaProducerService;

	private static final int TTL_EXPIRE_DAY = 7;
	private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final RoomUserRepository roomUserRepository;
	private final RoomRepository roomRepository;

	public void sendInvitation(RoomInviteRequestDto inviteRequestDto) {
		// roomId와 roomCode 일치하는 확인
		checkRoomIdAndRoomCode(inviteRequestDto);
		// 이미 방에 소속된 유저인 경우 오류 보내기
		validateExistingRoomUser(inviteRequestDto);
		String key = generateKey(inviteRequestDto);

		validateExistingInvitation(key);

		// 새 초대 데이터 생성 및 저장
		String invitationData = createInvitationData(inviteRequestDto);
		redisTemplate.opsForValue().set(key, invitationData);
		redisTemplate.expire(key, Duration.ofDays(TTL_EXPIRE_DAY));

		kafkaProducerService.sendRoomInvitation(invitationData);
		log.info("Invitation saved and sent to Kafka: {}", invitationData);
	}

	public void acceptInvitation(RoomInviteRequestDto inviteRequestDto) {
		updateInvitationStatus(inviteRequestDto, InvitationStatus.ACCEPTED);
	}

	public void rejectInvitation(RoomInviteRequestDto inviteRequestDto) {
		updateInvitationStatus(inviteRequestDto, InvitationStatus.REJECTED);
	}

	private void checkRoomIdAndRoomCode(RoomInviteRequestDto inviteRequestDto) {
		Long roomId = inviteRequestDto.getRoomId();
		String roomCode = inviteRequestDto.getRoomCode();
		Integer result = roomRepository.existsByRoomIdAndRoomCode(roomId, roomCode);
		if (result == 0) {
			throw new CustomException(CustomErrorCode.INVALID_ROOM);
		}
	}

	private void validateExistingRoomUser(RoomInviteRequestDto inviteRequestDto) {
		Long roomId = inviteRequestDto.getRoomId();
		Long receiverId = inviteRequestDto.getReceiverId();
		Integer result = roomUserRepository.existsByUserIdAndRoomId(roomId, receiverId);

		if (result == 1) {
			throw new CustomException(CustomErrorCode.EXISTING_ROOM_USER);
		}
	}

	private void validateExistingInvitation(String key) {
		Optional<InvitationData> existingInvitation = getInvitationDataFromRedis(key);
		existingInvitation.ifPresent(invitation -> {
			switch (invitation.getStatus()) {
				case PENDING -> throw new CustomException(CustomErrorCode.DUPLICATE_INVITATION);
				case REJECTED -> throw new CustomException(CustomErrorCode.INVITATION_REJECTED);
			}
		});
	}

	private Optional<InvitationData> getInvitationDataFromRedis(String key) {
		String existingData = (String)redisTemplate.opsForValue().get(key);
		if (existingData != null) {
			try {
				InvitationData invitationData = objectMapper.readValue(existingData, InvitationData.class);
				log.info("Get invitationData: {}", invitationData);
				return Optional.of(invitationData);
			} catch (JsonProcessingException e) {
				throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
			}
		}
		return Optional.empty();
	}

	private String createInvitationData(RoomInviteRequestDto inviteRequestDto) {
		try {
			InvitationData invitationData = new InvitationData(
				"room_request",
				inviteRequestDto.getSenderId(),
				userRepository.findNicknameById(inviteRequestDto.getSenderId()),
				inviteRequestDto.getReceiverId(),
				userRepository.findNicknameById(inviteRequestDto.getReceiverId()),
				LocalDateTime.now().format(DATE_TIME_FORMATTER),
				inviteRequestDto.getRoomId(),
				inviteRequestDto.getRoomCode(),
				"false",
				InvitationStatus.PENDING
			);
			return objectMapper.writeValueAsString(invitationData);
		} catch (Exception e) {
			log.error("Failed to create invitation data: {}", e.getMessage(), e);
			throw new CustomException(CustomErrorCode.FAILED_CREATE_INVITATION);
		}
	}

	private void updateInvitationStatus(RoomInviteRequestDto inviteRequestDto, InvitationStatus newStatus) {
		checkRoomIdAndRoomCode(inviteRequestDto);

		String key = generateKey(inviteRequestDto);
		try {
			String jsonData = (String) redisTemplate.opsForValue().get(key);
			if (jsonData != null) {
				InvitationData invitationData = objectMapper.readValue(jsonData, InvitationData.class);
				invitationData.setStatus(newStatus);  // 상태 업데이트

				String updatedJsonData = objectMapper.writeValueAsString(invitationData);
				redisTemplate.opsForValue().set(key, updatedJsonData);
				redisTemplate.expire(key, Duration.ofDays(TTL_EXPIRE_DAY));

				log.info("Invitation status updated to {}: {}", newStatus, updatedJsonData);
			} else {
				log.warn("Invitation not found for key: {}", key);
			}
		} catch (Exception e) {
			log.error("Failed to update invitation status: {}", e.getMessage(), e);
			throw new CustomException(CustomErrorCode.FAILED_INVITE_STATUS_UPDATE);
		}
	}

	private String generateKey(RoomInviteRequestDto inviteRequestDto) {
		return String.format("room_request:%d:%d:%d",
			inviteRequestDto.getSenderId(),
			inviteRequestDto.getReceiverId(),
			inviteRequestDto.getRoomId()
		);
	}
}
