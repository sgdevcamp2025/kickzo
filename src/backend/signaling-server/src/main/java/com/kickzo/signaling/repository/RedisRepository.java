package com.kickzo.signaling.repository;

import java.util.Set;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisRepository {
	private final StringRedisTemplate redisTemplate;

	public void addUserToRoom(String roomId, String userId) {
		if (Boolean.FALSE.equals(redisTemplate.opsForSet().isMember("room:" + roomId, userId))) {
			log.info("Adding user to room {} {}", roomId, userId);
			redisTemplate.opsForSet().add("room:" + roomId, userId);
		} else {
			log.error("User {} already in room {}", userId, roomId);
		}
	}

	public void removeUserFromRoom(String roomId, String userId) {
		log.info("Removing user from the room: {}", roomId);
		redisTemplate.opsForSet().remove("room:" + roomId, userId);
	}

	public Set<String> getUsersInRoom(String roomId) {
		log.info("Getting users in room {}", roomId);
		Set<String> memberList = redisTemplate.opsForSet().members("room:" + roomId);
		log.info("Found members: {}", memberList);
		return memberList;
	}
}
