package com.kickzo.signaling.controller;

import org.kurento.client.IceCandidate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.kickzo.signaling.model.Room;
import com.kickzo.signaling.model.UserSession;
import com.kickzo.signaling.service.RoomManager;
import com.kickzo.signaling.service.UserSessionManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class SignalingController {
	private final RoomManager roomManager;
	private final UserSessionManager userRegistry;

	// 하나의 엔드포인트에서 모든 WebSocket 메시지를 처리
	@MessageMapping("/signal")
	public void handleTextMessage(StompHeaderAccessor headerAccessor, @Payload String messageStr) {
		final JsonObject message = JsonParser.parseString(messageStr).getAsJsonObject();

		String sessionId = headerAccessor.getSessionId();

		final UserSession user = userRegistry.getBySessionId(sessionId);

		if (user != null) {
			log.info("Incoming message from user '{}': {}", user.getName(), message);
		} else {
			log.info("Incoming message from new user: {}", message);
		}

		String id = message.get("id").getAsString();
		log.info("📡 Received Signal: {}", id);

		switch (id) {
			case "joinRoom":
				joinRoom(sessionId, message);
				break;
			case "sdpOffer":
				final String senderName = message.get("sender").getAsString();
				final UserSession sender = userRegistry.getByName(senderName);
				final String sdpOffer = message.get("sdpOffer").getAsString();
				user.receiveAudioFrom(sender, sdpOffer);
				break;
			case "onIceCandidate":
				JsonObject candidateJson = message.getAsJsonObject("candidate");
				if (user != null) {
					IceCandidate cand = new IceCandidate(candidateJson.get("candidate").getAsString(),
						candidateJson.get("sdpMid").getAsString(), candidateJson.get("sdpMLineIndex").getAsInt());
					user.addCandidate(cand, message.get("sender").getAsString());
				}
				break;
			case "leaveRoom":
				leaveRoom(user);
				break;
			default:
				log.warn("⚠️ Unknown signal type: {}", id);
		}
	}

	private void joinRoom(String sessionId, JsonObject message) {
		String name = message.get("userName").getAsString();
		String roomCode = message.get("roomCode").getAsString();
		log.info("PARTICIPANT {}: trying to join room {}", name, roomCode);

		Room room = roomManager.getRoom(roomCode);
		final UserSession user = room.join(name, sessionId);

		userRegistry.register(user);
	}

	private void leaveRoom(UserSession user) {
		final Room room = roomManager.getRoom(user.getRoomCode());
		room.leave(user);
		if (room.getParticipants().isEmpty()) {
			roomManager.removeRoom(room);
		}
	}
}