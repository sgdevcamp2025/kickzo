package kickzo.stomp_chat.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class RoomManager {

    private final Map<String, Set<String>> rooms = new HashMap<>();
    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC_NAME = "chatting"; // Kafka 토픽 이름

    public RoomManager(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * 특정 방에 사용자 추가
     */
    public void joinRoom(String roomId, String userId) {
        rooms.computeIfAbsent(roomId, k -> new HashSet<>()).add(userId);
        System.out.println("User " + userId + " joined room " + roomId);
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
}
