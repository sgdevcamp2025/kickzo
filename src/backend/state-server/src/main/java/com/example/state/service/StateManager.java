package com.example.state.service;

import com.example.state.dto.UserStatusUpdateDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateManager {

    private final RedisService redisService;
    private final ObjectMapper objectMapper;
    private final FriendService friendService;
    private final KafkaProducerService kafkaProducerService;

    public StateManager(RedisService redisService, ObjectMapper objectMapper,
                        FriendService friendService, KafkaProducerService kafkaProducerService) {
        this.redisService = redisService;
        this.objectMapper = objectMapper;
        this.friendService = friendService;
        this.kafkaProducerService = kafkaProducerService;
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
                redisService.saveUserState(userId, "online", serverPort, String.valueOf(timestamp));

                List<String> friends = friendService.getFriends(userId);
                UserStatusUpdateDto statusUpdateDto = new UserStatusUpdateDto(userId, "online", friends, timestamp);
                kafkaProducerService.sendUserStatus(statusUpdateDto);
            } else {
                //유저 상태 제거 ("LEAVE")
                redisService.deleteUserState(userId);

                List<String> friends = friendService.getFriends(userId);
                UserStatusUpdateDto statusUpdateDto = new UserStatusUpdateDto(userId, "offline", friends, timestamp);
                kafkaProducerService.sendUserStatus(statusUpdateDto);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}