package com.kickzo.main.service;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.event.PlaylistItem;
import com.kickzo.main.dto.event.PlaylistUpdateEvent;
import com.kickzo.main.dto.event.RoleChangeEvent;
import com.kickzo.main.dto.event.RoomEvent;
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

	public void sendRoomUpdateMessage(Object eventData) {

		try {
			RoomEvent roomEvent = new RoomEvent("room-update", eventData);
			String message = objectMapper.writeValueAsString(roomEvent);
			kafkaTemplate.send(TOPIC_ROOM, message);
			log.info("Kafka Room Update Event Sent: {}", message);
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}

	public void sendRoleChangeEvent(Long roomId, Long targetUserId, int newRole) {
		RoleChangeEvent event = new RoleChangeEvent(roomId, targetUserId, newRole);
		RoomEvent roomEvent = new RoomEvent("role-change", event);
		try {
			String message = objectMapper.writeValueAsString(roomEvent);
			kafkaTemplate.send(TOPIC_ROOM, message);
			log.info("Kafka Role Change Event Sent: {}", message);
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}

	public void sendPlaylistUpdate(Long roomId, List<PlaylistItem> playlistJson) {
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
