package com.kickzo.main.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.kickzo.main.dto.request.RoomInviteRequestDto;
import com.kickzo.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final UserRepository userRepository;

	private static final int TTL_EXPIRE_DAY = 7;

	// 1. 초대 저장
	public void saveInvitation(RoomInviteRequestDto inviteRequestDto) {
		Long senderId = inviteRequestDto.getSenderId();
		Long receiverId = inviteRequestDto.getReceiverId();
		Long roomId = inviteRequestDto.getRoomId();

		String key = generateKey(senderId, receiverId, roomId);

		String SenderNickname = userRepository.findNicknameById(senderId);
		String ReceiverNickname = userRepository.findNicknameById(receiverId);
		String roomCode = inviteRequestDto.getRoomCode();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String formattedDate = LocalDateTime.now().format(formatter);

		redisTemplate.opsForHash().put(key, "type", "room_request");
		redisTemplate.opsForHash().put(key, "senderId", senderId);
		redisTemplate.opsForHash().put(key, "senderNickname", SenderNickname);
		redisTemplate.opsForHash().put(key, "receiverId", receiverId);
		redisTemplate.opsForHash().put(key, "receiverNickname", ReceiverNickname);
		redisTemplate.opsForHash().put(key, "timestamp", formattedDate);
		redisTemplate.opsForHash().put(key, "roomId", roomId);
		redisTemplate.opsForHash().put(key, "roomCode", roomCode);
		redisTemplate.opsForHash().put(key, "isRead", "false");

		// TTL 설정 (7일)
		redisTemplate.expire(key, Duration.ofDays(TTL_EXPIRE_DAY));
	}

	// 2. 초대 수락
	public void acceptInvitation(RoomInviteRequestDto inviteRequestDto) {
		String key = generateKey(inviteRequestDto.getSenderId(), inviteRequestDto.getReceiverId(), inviteRequestDto.getRoomId());
		if (Boolean.FALSE.toString().equals(redisTemplate.opsForHash().get(key, "isRead"))) {
			redisTemplate.opsForHash().put(key, "isRead", "true");
		}
		redisTemplate.delete(key);
	}

	// 3. 초대 거절
	public void rejectInvitation(Long senderId, Long receiverId, Long roomId) {
		String key = generateKey(senderId, receiverId, roomId);
		redisTemplate.delete(key);
	}

	private String generateKey(Long senderId, Long receiverId, Long roomId) {
		return String.format("invitation:%s:%d:%d:%d", "room_request", senderId, receiverId, roomId);
	}
}
