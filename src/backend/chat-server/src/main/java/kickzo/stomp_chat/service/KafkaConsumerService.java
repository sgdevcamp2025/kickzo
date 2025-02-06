package kickzo.stomp_chat.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import kickzo.stomp_chat.event.PlaylistUpdateEvent;
import kickzo.stomp_chat.event.RoleChangeEvent;
import kickzo.stomp_chat.event.RoomEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

	private final ObjectMapper objectMapper;

	@Value("${server.port}")
	private String serverPort;

	@Value("${spring.kafka.bootstrap-servers}")
	private String KAFKA_BROKER; // Kafka 브로커 주소

	@Value(("${spring.kafka.consumer.group-id}"))
	private String groupId;

	// 서버 포트에 맞춰서 groupId를 동적으로 설정하는 메서드
	@PostConstruct
	public void init() {
		groupId = "my-group-" + serverPort; // 서버 포트에 따라 groupId 설정
	}


	@KafkaListener(topics = "room")
	public void consumeRoomEvents(ConsumerRecord<String, String> record) {
		try {
			RoomEvent event = objectMapper.readValue(record.value(), RoomEvent.class);
			log.info("Received Room Event: {}", event);

			switch (event.getEventType()) {
				case "room-update":
					handleRoomUpdate(event);
					break;
				case "role-change":
					handleRoleChange(event);
					break;
				default:
					log.warn("Unknown event type: {}", event.getEventType());
			}

		} catch (Exception e) {
			log.error("Error processing room event", e);
		}
	}

	@KafkaListener(topics = "playlist")
	public void consumePlaylistEvents(ConsumerRecord<String, String> record) {
		try {
			PlaylistUpdateEvent event = objectMapper.readValue(record.value(), PlaylistUpdateEvent.class);
			log.info("Received Playlist Update Event: {}", event);
			handlePlaylistUpdate(event);
		} catch (Exception e) {
			log.error("Error processing playlist event", e);
		}
	}

	private void handleRoomUpdate(RoomEvent event) {
		log.info("Handling Room Update: {}", event);
		// 실제 로직 추가
	}

	private void handleRoleChange(RoomEvent event) {
		log.info("Handling Role Change: {}", event);
		RoleChangeEvent roleChange = objectMapper.convertValue(event.getData(), RoleChangeEvent.class);
		log.info("Received Role Change Event: {}", roleChange);
	}

	private void handlePlaylistUpdate(PlaylistUpdateEvent event) {
		log.info("Handling Playlist Update: {}", event);
		// 실제 로직 추가
	}
}
