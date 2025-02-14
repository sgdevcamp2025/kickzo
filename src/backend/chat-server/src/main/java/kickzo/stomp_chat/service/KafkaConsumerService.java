package kickzo.stomp_chat.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.RoomEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

	private final ObjectMapper objectMapper;
	private final RoomEventHandler roomEventHandler;
	private final PlaylistEventHandler playlistEventHandler;

	@KafkaListener(topics = "playlist")
	public void consumePlaylistEvents(ConsumerRecord<String, String> record) {
		try {
			RoomEvent event = objectMapper.readValue(record.value(), RoomEvent.class);
			// PlaylistUpdateEvent event = objectMapper.readValue(record.value(), PlaylistUpdateEvent.class);
			log.info("Received Playlist Update Event: {}", event);
			playlistEventHandler.handleEvent(event);
		} catch (Exception e) {
			log.error("Error processing playlist event", e);
		}
	}

	@KafkaListener(topics = "room")
	public void consumeRoomEvents(ConsumerRecord<String, String> record) {
		try {
			RoomEvent event = objectMapper.readValue(record.value(), RoomEvent.class);
			log.info("Received Room Event: {}", event);
			roomEventHandler.handleEvent(event);
		} catch (Exception e) {
			log.error("Error processing room event", e);
		}
	}
}
