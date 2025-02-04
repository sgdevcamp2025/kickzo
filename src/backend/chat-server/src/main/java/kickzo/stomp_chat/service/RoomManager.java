package kickzo.stomp_chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class RoomManager {

    private final Map<String, Set<String>> rooms = new HashMap<>();
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC_NAME = "chatting"; // Kafka 토픽 이름
    private static final String TOPIC_CONNECTION = "connection";

    @Value("${server.port}")  // 현재 서버 포트 번호 주입
    private String serverPort;

    public RoomManager(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 특정 방에 사용자 추가
     */
    public void joinRoom(String roomId, String userId) {
        rooms.computeIfAbsent(roomId, k -> new HashSet<>()).add(userId);
        System.out.println("User " + userId + " joined room " + roomId);

        sendConnection(userId, roomId, "JOIN");
    }

    /**
     * 특정 방에서 사용자 제거
     */
    public void leaveRoom(String roomId, String userId) {
        Set<String> users = rooms.get(roomId);
        if (users != null) {
            users.remove(userId);
            if (users.isEmpty()) {
                rooms.remove(roomId);
            }
        }
        System.out.println("User " + userId + " left room " + roomId);

        sendConnection(userId, roomId, "LEAVE");
    }

    /**
     * 특정 방의 사용자 목록 조회
     */
    public Set<String> getUsersInRoom(String roomId) {
        return rooms.getOrDefault(roomId, new HashSet<>());
    }

    /**
     * 방에 메시지 전송
     */
    public void sendMessage(String roomId, String userId, String content) {
        String message = String.format("{\"type\":\"message\",\"roomId\":\"%s\",\"userId\":\"%s\",\"content\":\"%s\"}",
                roomId, userId, content);
        kafkaTemplate.send(TOPIC_NAME, message);
        System.out.println("Kafka message sent: " + message);
    }

    //kafka에 connection 보내기
    public void sendConnection(String userId, String roomId, String eventType) {
        try {
            Map<String, String> message = new HashMap<>();
            message.put("userId", userId);
            message.put("roomId", roomId);
            message.put("eventType", eventType);   //Join or Leave
            message.put("serverPort", serverPort);
            message.put("timestamp", Instant.now().toString());

            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(TOPIC_CONNECTION, jsonMessage);
            System.out.println("Kafka connection event sent: " + jsonMessage);
        } catch (Exception e) {
            System.err.println("Faile to send Kafka connection event: " + e.getMessage());
        }
    }
}
