package com.kickzo.main.service;

import java.time.Duration;
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

	private final RedisTemplate<String, InvitationData> redisTemplate;
	private final UserRepository userRepository;
	private final KafkaProducerService kafkaProducerService;

	private static final int TTL_EXPIRE_DAY = 7;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final RoomUserRepository roomUserRepository;
	private final RoomRepository roomRepository;

	public void sendInvitation(Long senderId, RoomInviteRequestDto inviteRequestDto) {
		ensureSenderIdMatch(senderId, inviteRequestDto);
		// roomId와 roomCode 일치하는 확인
		checkRoomIdAndRoomCode(inviteRequestDto);
		// 이미 방에 소속된 유저인 경우 오류 보내기
		validateExistingRoomUser(inviteRequestDto);

		String key = generateKey(inviteRequestDto);
		validateExistingInvitation(key);

		// 새 초대 데이터 생성 및 저장
		InvitationData invitationData = createInvitationData(inviteRequestDto);
		saveInvitationData(key, invitationData);

		try {
			kafkaProducerService.sendRoomInvitation(objectMapper.writeValueAsString(invitationData));
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
		log.info("Invitation saved and sent to Kafka: {}", invitationData);
	}

	public void acceptInvitation(Long receiverId, RoomInviteRequestDto inviteRequestDto) {
		handleInvitation(receiverId, inviteRequestDto, InvitationStatus.ACCEPTED);
	}

	public void rejectInvitation(Long receiverId, RoomInviteRequestDto inviteRequestDto) {
		handleInvitation(receiverId, inviteRequestDto, InvitationStatus.REJECTED);
	}

	private void handleInvitation(Long receiverId, RoomInviteRequestDto inviteRequestDto, InvitationStatus status) {
		ensureReceiverIdMatch(receiverId, inviteRequestDto);
		updateInvitationStatus(inviteRequestDto, status);
	}

	private void ensureSenderIdMatch(Long senderId, RoomInviteRequestDto inviteRequestDto) {
		if (!senderId.equals(inviteRequestDto.getSenderId())) {
			throw new CustomException(CustomErrorCode.INVALID_SENDER);
		}
	}

	private void ensureReceiverIdMatch(Long receiverId, RoomInviteRequestDto inviteRequestDto) {
		if (!receiverId.equals(inviteRequestDto.getReceiverId())) {
			throw new CustomException(CustomErrorCode.INVALID_RECEIVER);
		}
	}

	private void checkRoomIdAndRoomCode(RoomInviteRequestDto inviteRequestDto) {
		Long roomId = inviteRequestDto.getRoomId();
		String roomCode = inviteRequestDto.getRoomCode();
		if (roomRepository.existsByRoomIdAndRoomCode(roomId, roomCode) == 0) {
			throw new CustomException(CustomErrorCode.INVALID_ROOM);
		}
	}

	private void validateExistingRoomUser(RoomInviteRequestDto inviteRequestDto) {
		Long roomId = inviteRequestDto.getRoomId();
		Long senderId = inviteRequestDto.getSenderId();
		Long receiverId = inviteRequestDto.getReceiverId();
		// 초대 보낸 유저가 해당 방에 있어야 함
		if (roomUserRepository.existsByUserIdAndRoomId(roomId, senderId) == 0) {
			throw new CustomException(CustomErrorCode.SENDER_NOT_FOUND);
		}
		// 초대 받은 유저가 해당 방에 없어야 함
		if (roomUserRepository.existsByUserIdAndRoomId(roomId, receiverId) == 1) {
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
		// 바로 InvitationData로 반환
		InvitationData invitationData = redisTemplate.opsForValue().get(key);
		return Optional.ofNullable(invitationData);
	}

	private InvitationData createInvitationData(RoomInviteRequestDto inviteRequestDto) {
		return new InvitationData(
			"room_request",
			inviteRequestDto.getSenderId(),
			userRepository.findNicknameById(inviteRequestDto.getSenderId()),
			inviteRequestDto.getReceiverId(),
			userRepository.findNicknameById(inviteRequestDto.getReceiverId()),
			System.currentTimeMillis(),
			inviteRequestDto.getRoomId(),
			inviteRequestDto.getRoomCode(),
			false,
			InvitationStatus.PENDING
		);
	}

	private void updateInvitationStatus(RoomInviteRequestDto inviteRequestDto, InvitationStatus newStatus) {
		checkRoomIdAndRoomCode(inviteRequestDto);

		String key = generateKey(inviteRequestDto);
		try {
			InvitationData invitationData = redisTemplate.opsForValue().get(key);
			if (invitationData == null) {
				log.warn("Invitation not found for key: {}", key);
				throw new CustomException(CustomErrorCode.INVITATION_NOT_FOUND);
			}
			invitationData.setStatus(newStatus);
			saveInvitationData(key, invitationData);
			log.info("Invitation status updated to {}: {}", newStatus, invitationData);
		} catch (Exception e) {
			log.error("Failed to update invitation status: {}", e.getMessage(), e);
			throw new CustomException(CustomErrorCode.FAILED_INVITE_STATUS_UPDATE);
		}
	}

	private void saveInvitationData(String key, InvitationData invitationData) {
		redisTemplate.opsForValue().set(key, invitationData);
		redisTemplate.expire(key, Duration.ofDays(TTL_EXPIRE_DAY));
	}

	private String generateKey(RoomInviteRequestDto inviteRequestDto) {
		return String.format("room_request:%d:%d:%d",
			inviteRequestDto.getSenderId(),
			inviteRequestDto.getReceiverId(),
			inviteRequestDto.getRoomId()
		);
	}
}
