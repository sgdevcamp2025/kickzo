package com.kickzo.main.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;
import com.kickzo.main.repository.RoomUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomUserService {

	private final RoomUserRepository roomUserRepository;
	private final KafkaProducerService kafkaProducerService;

	private static final int ROLE_MEMBER = 2;

	@Transactional
	public void changeUserRole(Long userId, Long roomId, Long targetUserId, int newRole) {
		checkAccessRole(userId, roomId);

		RoomUserId targetId = new RoomUserId(roomId, targetUserId);
		Optional<RoomUser> targetUser = roomUserRepository.findById(targetId);

		if (targetUser.isEmpty()) {
			throw new CustomException(CustomErrorCode.USER_NOT_FOUND);
		}

		targetUser.get().setRole(newRole);
		kafkaProducerService.sendRoleChangeEvent(roomId, targetUserId, newRole);
	}

	public void checkAccessRole(Long userId, Long roomId){
		RoomUserId requesterId = new RoomUserId(roomId, userId);
		Optional<RoomUser> requester = roomUserRepository.findById(requesterId);

		if (requester.isEmpty()) {
			throw new CustomException(CustomErrorCode.ROOM_USER_NOT_FOUND);
		}

		if (requester.get().getRole() == ROLE_MEMBER) {
			throw new CustomException(CustomErrorCode.INVALID_ACCESS_ROLE);
		}
	}
}
