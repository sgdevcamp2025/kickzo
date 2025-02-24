package com.kickzo.main.repository;

import java.util.Set;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class UserEnterRedisRepository {

	private final RedisTemplate<String, String> redisActiveUsersTemplate;

	/**
	 * 주어진 roomId에 해당하는 Redis key에 userId를 추가합니다.
	 * 키 형식은 "room:{roomId}:users" 입니다.
	 */
	public void addUserToRoom(Long roomId, Long userId) {
		String redisKey = "room:" + roomId + ":users";

		// 현재 사용 중인 RedisConnectionFactory 정보 출력 (디버깅용)
		RedisConnectionFactory factory = redisActiveUsersTemplate.getConnectionFactory();
		if (factory instanceof LettuceConnectionFactory) {
			int dbIndex = ((LettuceConnectionFactory) factory).getDatabase();
			log.info("redisActiveUsersTemplate is using Redis DB: {}", dbIndex);
		}

		redisActiveUsersTemplate.opsForSet().add(redisKey, String.valueOf(userId));
		log.info("User {} added to Redis with key {} (via RedisTemplate: {})", userId, redisKey, redisActiveUsersTemplate);
	}

	/**
	 * 특정 방의 현재 온라인 유저 목록을 Redis에서 가져옴
	 */
	public Set<String> getOnlineUsers(long roomId) {
		String redisKey = "room:" + roomId + ":users";
		Set<String> onlineUsers = redisActiveUsersTemplate.opsForSet().members(redisKey); // 현재 온라인 유저 가져오기
		log.info("Fetching user list for room {}. Online users from Redis: {}", roomId, onlineUsers);
		return onlineUsers;
	}
}
