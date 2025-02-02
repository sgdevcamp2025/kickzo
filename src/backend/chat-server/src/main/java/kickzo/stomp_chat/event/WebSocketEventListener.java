package kickzo.stomp_chat.event;

import kickzo.stomp_chat.service.RoomManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private RoomManager roomManager;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        // 새로운 WebSocket 연결 발생 시
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        System.out.println("New WebSocket connection: " + sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // WebSocket 연결 해제 시
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        String roomId = "1"; // 예시로 단일 방 사용

        if (userId != null) {
            roomManager.leaveRoom(roomId, userId);
        }
        System.out.println("WebSocket disconnected: " + userId);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메세지 브로커가 처리할 목적지 지정
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // STOMP 엔드포인트 등록 (WebSocket 접속 경로)
        registry.addEndpoint("/stomp-chat").withSockJS();
    }
}

