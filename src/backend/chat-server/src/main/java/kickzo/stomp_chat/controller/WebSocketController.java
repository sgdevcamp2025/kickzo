package kickzo.stomp_chat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.enums.UserEventType;
import kickzo.stomp_chat.service.WebSocketRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final WebSocketRoomService webSocketRoomService;

    @MessageMapping("/connect")
    public void connect(String payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // payload를 UserConnectRequest 객체로 변환
            UserConnectRequest request = objectMapper.readValue(payload, UserConnectRequest.class);
            Long userId = request.userId();
            // 세션에 사용자 정보 저장
            headerAccessor.getSessionAttributes().put("userId", userId);

            webSocketRoomService.sendConnection(userId, UserEventType.JOIN);
            log.info("User {} connected and is now online.", userId);
        } catch (Exception e) {
            log.error("Error processing connect message", e);
        }
    }

    // @MessageMapping("/joinRoom")
    // public void joinRoom(String payload, SimpMessageHeaderAccessor headerAccessor) throws Exception {
    //     try {
    //         JoinRoomRequest request = objectMapper.readValue(payload, JoinRoomRequest.class);
    //         Long userId = request.userId();
    //         long roomId = request.roomId();
    //         headerAccessor.getSessionAttributes().put("userId", userId);
    //         headerAccessor.getSessionAttributes().put("roomId", roomId);
    //
    //         webSocketRoomService.handleRoomUserJoin(request.roomId(), userId);
    //         messagingTemplate.convertAndSend("/topic/room/" + roomId, userId + " has joined the room.");
    //     } catch (Exception e) {
    //         log.error("Error processing joinRoom message", e);
    //     }
    // }

    @MessageMapping("/sendMessage")
    public void sendMessage(String payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            SendMessageRequest request = objectMapper.readValue(payload, SendMessageRequest.class);
            long userId = (Long) headerAccessor.getSessionAttributes().get("userId");

            webSocketRoomService.handleMessageSend(request.roomId(), userId, request.content(), request.message());
        } catch (Exception e) {
            log.error("Error processing sendMessage message", e);
        }
    }

    @MessageMapping("/playlistTime")
    public void playlistTime(String payload) throws Exception {
        PlaylistTimeRequest request = objectMapper.readValue(payload, PlaylistTimeRequest.class);
        log.info("Received roomId : {}, playlist time: {}", request.roomId(), request.playlistTime());

        webSocketRoomService.sendPlaylistTime(request.roomId(), request.playlistTime());
    }

    public record UserConnectRequest(long userId) {}
    public record SendMessageRequest(long roomId, long userId, String content, String message) {}

    public record PlaylistTimeRequest(long roomId, long playlistTime) {}
}
