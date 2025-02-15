package kickzo.stomp_chat.event;

import kickzo.stomp_chat.service.WebSocketRoomService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
public class WebSocketEventListener implements WebSocketMessageBrokerConfigurer {

	@Autowired
	private WebSocketRoomService webSocketRoomService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        // 새로운 WebSocket 연결 발생 시
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("New WebSocket connection: " + sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // WebSocket 연결 해제 시
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");  // 형 변환

        if (userId != null) {
            webSocketRoomService.leavePage(userId);
        }
        log.info("WebSocket disconnected: " + userId);
    }

    // @Override
    // public void configureMessageBroker(MessageBrokerRegistry registry) {
    //     // 메세지 브로커가 처리할 목적지 지정
    //     registry.enableSimpleBroker("/topic");
    //     registry.setApplicationDestinationPrefixes("/app");
    // }
    //
    // @Override
    // public void registerStompEndpoints(StompEndpointRegistry registry) {
    //     // STOMP 엔드포인트 등록 (WebSocket 접속 경로)
    //     registry.addEndpoint("/stomp-chat").withSockJS();
    // }
}
