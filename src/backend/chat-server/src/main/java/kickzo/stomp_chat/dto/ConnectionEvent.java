package kickzo.stomp_chat.dto;

import java.time.Instant;

import kickzo.stomp_chat.enums.UserEventType;

public record ConnectionEvent(long userId, UserEventType userEventType, String serverPort, long timestamp) {
	public ConnectionEvent(long userId, UserEventType userEventType, String serverPort) {
		this(userId, userEventType, serverPort, Instant.now().toEpochMilli());
	}
}
