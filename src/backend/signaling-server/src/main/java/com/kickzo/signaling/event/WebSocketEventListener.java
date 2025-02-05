package com.kickzo.signaling.event;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.kickzo.signaling.model.UserSession;
import com.kickzo.signaling.service.RoomManager;
import com.kickzo.signaling.service.UserSessionManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

	private final UserSessionManager userRegistry;
	private final RoomManager roomManager;

	@EventListener
	public void handleSessionConnectEvent(SessionConnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
		log.info("WebSocket connected with session ID {}", sessionId);
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
		log.info("WebSocket disconnected with session ID {}", sessionId);

		UserSession user = userRegistry.removeBySessionId(sessionId);
		roomManager.getRoom(user.getRoomCode()).leave(user);
	}
}
