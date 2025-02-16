package kickzo.stomp_chat.repository;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.room.ChatMessage;
import kickzo.stomp_chat.dto.user.ConnectionEvent;
import kickzo.stomp_chat.dto.RoomEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaRepository {
	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper;
	private static final String TOPIC_CHAT = "chatting";
	private static final String TOPIC_CONNECTION = "connection";
	private static final String TOPIC_PLAYLIST = "playlist";

	public void sendConnectionEvent(ConnectionEvent event) {
		try {
			String jsonMessage = objectMapper.writeValueAsString(event);
			kafkaTemplate.send(TOPIC_CONNECTION, jsonMessage);
			log.info("Kafka connection event sent: {}", jsonMessage);
		} catch (Exception e) {
			log.error("Failed to send Kafka connection event: {}", e.getMessage());
		}
	}

	public void sendChatMessage(ChatMessage chatMessage) {
		try {
			String jsonMessage = objectMapper.writeValueAsString(chatMessage);
			kafkaTemplate.send(TOPIC_CHAT, jsonMessage);
			log.info("Kafka message sent: {}", jsonMessage);
		} catch (Exception e) {
			log.error("Failed to send Kafka chat message: {}", e.getMessage());
		}
	}

	public void sendPlaylistTime(RoomEvent playTimeEvent) {
		try {
			String jsonMessage = objectMapper.writeValueAsString(playTimeEvent);
			kafkaTemplate.send(TOPIC_PLAYLIST, jsonMessage);
			log.info("Kafka playlist time sent: {}", jsonMessage);
		} catch (Exception e) {
			log.error("Failed to send Kafka playlist time: {}", e.getMessage());
		}
	}
}
