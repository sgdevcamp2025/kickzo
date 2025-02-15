package kickzo.stomp_chat.dto;

import java.time.Instant;

import kickzo.stomp_chat.enums.EventType;

public record ConnectionEvent(long userId, EventType eventType, String serverPort, long timestamp) {
	public ConnectionEvent(long userId, EventType eventType, String serverPort) {
		this(userId, eventType, serverPort, Instant.now().toEpochMilli());
	}
}
