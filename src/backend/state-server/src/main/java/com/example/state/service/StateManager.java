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
            Long userId = jsonNode.get("userId").asLong();  // userId를 Long으로 변환
            String serverPort = jsonNode.get("serverPort").asText();
            Long timestamp = jsonNode.get("timestamp").asLong();  // timestamp를 Long으로 변환

            System.out.println("Processing event: " + eventType + " for user: " + userId);

            if ("JOIN".equals(eventType)) {
                // 온라인 상태 저장
                redisService.saveUserState(userId, "online", serverPort, timestamp);

                List<Long> friends = friendService.getFriends(userId);  // 친구 리스트도 Long 타입으로 변경
                UserStatusUpdateDto statusUpdateDto = new UserStatusUpdateDto(userId, "online", friends, timestamp);
                kafkaProducerService.sendUserStatus(statusUpdateDto);
            } else {
                // 유저 상태 제거 ("LEAVE")
                redisService.deleteUserState(userId);

                List<Long> friends = friendService.getFriends(userId);  // 친구 리스트도 Long 타입으로 변경
                UserStatusUpdateDto statusUpdateDto = new UserStatusUpdateDto(userId, "offline", friends, timestamp);
                kafkaProducerService.sendUserStatus(statusUpdateDto);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
