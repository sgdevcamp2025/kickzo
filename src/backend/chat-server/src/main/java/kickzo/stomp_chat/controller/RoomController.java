package kickzo.stomp_chat.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.MessageResponseDto;
import kickzo.stomp_chat.service.RoomManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class RoomController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomManager roomManager;
    private final ObjectMapper objectMapper;

    @MessageMapping("/joinRoom")
    public void joinRoom(String payload, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(payload);
        long roomId = jsonNode.get("roomId").asLong();
        long userId = jsonNode.get("userId").asLong();

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
        long roomId = jsonNode.get("roomId").asLong();
        String message = jsonNode.get("message").asText();
        long userId = (Long) headerAccessor.getSessionAttributes().get("userId");

        // RoomManager에 메시지 전송 (Kafka로 메시지 전송)
        roomManager.sendMessage(roomId, userId, message);

        // 메시지 브로드캐스트

        MessageResponseDto messageResponseDto = new MessageResponseDto(userId, message);
        //messagingTemplate.convertAndSend("/topic/" + roomId, response);
    }

    @MessageMapping("/playlistTime")
    public void playlistTime(String payload) throws Exception {
        PlaylistTimeRequest request = objectMapper.readValue(payload, PlaylistTimeRequest.class);
        log.info("Received roomId : {}, playlist time: {}", request.roomId(), request.playlistTime());

        PlaylistTimeResponse response = new PlaylistTimeResponse(request.roomId(), request.playlistTime());
        messagingTemplate.convertAndSend("/topic/room/" + request.roomId() + "/playlistTime", response);
    }

    public record PlaylistTimeRequest(long roomId, long playlistTime) {}
    public record PlaylistTimeResponse(long roomId, long playlistTime) {}
}
