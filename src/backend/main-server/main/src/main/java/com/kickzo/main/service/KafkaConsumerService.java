package com.kickzo.main.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.event.RoomEvent;
import com.kickzo.main.dto.event.UserOutEvent;
import com.kickzo.main.repository.UserOutRedisRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

	private final ObjectMapper objectMapper;
	private final UserOutRedisRepository userOutRedisRepository;

	@KafkaListener(topics = "room")
	public void consumeRoomEvents(ConsumerRecord<String, String> record) {
		try {
			RoomEvent event = objectMapper.readValue(record.value(), RoomEvent.class);
			log.info("Received Room Event: {}", event);
			processUserOutEvent(event);
		} catch (Exception e) {
			log.error("Error processing room event", e);
		}
	}

	private void processUserOutEvent(RoomEvent event) {
		UserOutEvent userOut = objectMapper.convertValue(event.getData(), UserOutEvent.class);
		long userId = userOut.getUserId();
		long roomId = userOut.getRoomId();
		userOutRedisRepository.removeUserFromRoom(roomId, userId);
	}
}
