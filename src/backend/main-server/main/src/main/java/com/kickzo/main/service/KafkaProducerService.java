package com.kickzo.main.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.PlaylistUpdateEvent;
import com.kickzo.main.dto.RoleChangeEvent;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper;
	private static final String TOPIC_ROOM = "room";
	private static final String TOPIC_PLAYLIST = "playlist";

	public void sendRoomUpdateMessage(String message) {
		CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(TOPIC_ROOM, message);

		future.thenAccept(result -> {
			log.info("Produced message to Kafka: {}", message);
		}).exceptionally(ex -> {
			log.error("Failed to send Kafka message: {}", ex.getMessage());
			throw new CustomException(CustomErrorCode.KAFKA_MESSAGE_SEND_FAILED);
		});

		future.join(); // 동기 호출하여 트랜잭션 내에서 예외 발생
	}

	public void sendRoleChangeEvent(Long roomId, Long targetUserId, int newRole) {
		RoleChangeEvent event = new RoleChangeEvent(roomId, targetUserId, newRole);

		try {
			String message = objectMapper.writeValueAsString(event);
			kafkaTemplate.send(TOPIC_ROOM, message);
			log.info("Kafka Role Change Event Sent: {}", message);
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}

	public void sendPlaylistUpdate(Long roomId, String playlistJson) {
		PlaylistUpdateEvent event = new PlaylistUpdateEvent(roomId, playlistJson);
		// Kafka 메시지 발행
		try {
			String message = objectMapper.writeValueAsString(event);
			kafkaTemplate.send(TOPIC_PLAYLIST, message);
			log.info("Kafka Playlist Change Event Sent: {}", message);
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}

	}
}
