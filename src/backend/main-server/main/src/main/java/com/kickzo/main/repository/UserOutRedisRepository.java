package com.kickzo.main.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class UserOutRedisRepository {

	private final RedisTemplate<String, String> redisActiveUsersTemplate;

	/**
	 * 특정 방(roomId)에서 userId 제거
	 */
	public void removeUserFromRoom(Long roomId, Long userId) {
		String redisKey = "room:" + roomId + ":users";
		redisActiveUsersTemplate.opsForSet().remove(redisKey, String.valueOf(userId));
	}
}
