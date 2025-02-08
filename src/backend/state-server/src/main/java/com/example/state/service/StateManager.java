package com.example.state.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class StateManager {

    private final RedisService redisService;
    private final ObjectMapper objectMapper;

    public StateManager(RedisService redisService, ObjectMapper objectMapper) {
        this.redisService = redisService;
        this.objectMapper = objectMapper;
    }

    // 메시지를 수신하고 처리하는 간단한 로직
    public void consumeMessage(String message) {
        // 메시지 처리
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            String eventType = jsonNode.get("eventType").asText();
            String userId = jsonNode.get("userId").asText();
            String serverPort = jsonNode.get("serverPort").asText();
            String timestamp = jsonNode.get("timestamp").asText();

            System.out.println("Processing event: " + eventType + " for user: " + userId);

            if ("JOIN".equals(eventType)) {
                //online 상태 저장
                redisService.saveUserState(userId, "online", serverPort, timestamp);
            } else {
                //유저 상태 제거 ("LEAVE")
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
