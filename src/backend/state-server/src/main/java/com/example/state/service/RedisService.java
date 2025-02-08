package com.example.state.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class RedisService {
    private static final Logger logger = LoggerFactory.getLogger(RedisService.class);
    private final StringRedisTemplate redisTemplate;

    public RedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    //사용자 상태 저장 (case JOIN)
    public void saveUserState(String userId, String status, String serverPort, String timestamp) {
        String key = "user:state:" + userId;

        Map<String, String> stateData = new HashMap<>();
        stateData.put("status", status);
        stateData.put("serverPort", serverPort);
        stateData.put("timestamp", timestamp);

        // Redis 연결 정보 로그 출력
        logger.info("Connecting to Redis at {}:{}", redisHost, redisPort);
        // 저장하기 전에 로그 출력
        logger.info("Saving user state to Redis - Key: {}, Data: {}", key, stateData);

        redisTemplate.opsForHash().putAll(key, stateData);

        // 저장 후 로그 출력
        logger.info("Successfully saved user state for userId: {}", userId);
    }

    //사용자 상태 조회

    //사용자 상태 삭제
}
