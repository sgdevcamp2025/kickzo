package com.example.state.service;

import com.example.state.dto.UserStatusUpdateDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateManager {
    // TODO[SMG-C]: 네이밍 변경
    // 여러 repository를 활용해서 비즈니스 로직을 구현한 계층이라 Service 네이밍을 넣으면 좋을거 같아요
    // 참고 : https://medium.com/@ankitpal181/service-repository-pattern-802540254019

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
            // TODO[SMG-C]: json > model 변환
            // object 변환해서 사용하는게 더 편하실거에요
            // ex. objectMapper.readValue(message, Message.class);
            JsonNode jsonNode = objectMapper.readTree(message);
            String eventType = jsonNode.get("eventType").asText();
            String userId = jsonNode.get("userId").asText();
            String serverPort = jsonNode.get("serverPort").asText();
            String timestamp = jsonNode.get("timestamp").asText();

            // TODO[SMG-C]: logger 사용 권장
            // system out 대신 logger 사용 권장. @Slf4j 참고
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

            // TODO[SMG-C]: logger 사용 권장
            // ex. log.error("Error processing message: {}", e.getMessage(), e);
        }
    }
}