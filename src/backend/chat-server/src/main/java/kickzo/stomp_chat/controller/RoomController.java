package kickzo.stomp_chat.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kickzo.stomp_chat.service.RoomManager;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class RoomController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomManager roomManager;  // RoomManager를 선언
    private final ObjectMapper objectMapper;

    public RoomController(SimpMessagingTemplate messagingTemplate, RoomManager roomManager) {
        this.messagingTemplate = messagingTemplate;
        this.roomManager = roomManager;  // RoomManager 주입
        this.objectMapper = new ObjectMapper();
    }

    @MessageMapping("/joinRoom")
    public void joinRoom(String payload, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(payload);
        String roomId = jsonNode.get("roomId").asText();
        String userId = jsonNode.get("userId").asText();

        // 세션에 사용자 정보 저장
        headerAccessor.getSessionAttributes().put("userId", userId);

        // RoomManager에 사용자 추가
        roomManager.joinRoom(roomId, userId);

        // 방에 참가한 사용자가 있음을 알리는 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/" + roomId, userId + " has joined the room.");
    }

    @MessageMapping("/sendMessage")
    public void sendMessage(String payload, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(payload);
        String roomId = jsonNode.get("roomId").asText();
        String message = jsonNode.get("message").asText();
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");

        // RoomManager에 메시지 전송 (Kafka로 메시지 전송)
        roomManager.sendMessage(roomId, userId, message);

        // 메시지 브로드캐스트
        MessageResponse response = new MessageResponse(userId, message);
        //messagingTemplate.convertAndSend("/topic/" + roomId, response);
    }

    public static class MessageResponse {
        private String userId;
        private String message;

        public MessageResponse(String userId, String message) {
            this.userId = userId;
            this.message = message;
        }

        public String getUserId() {
            return userId;
        }

        public String getMessage() {
            return message;
        }
    }
}
