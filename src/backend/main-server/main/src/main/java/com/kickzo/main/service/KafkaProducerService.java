package com.kickzo.main.service;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.event.NewUserJoinEvent;
import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.dto.event.PlaylistUpdateEvent;
import com.kickzo.main.dto.event.RoleChangeEvent;
import com.kickzo.main.dto.event.RoomEvent;
import com.kickzo.main.dto.response.UserInfoDto;
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

	// Topics
	private static final String TOPIC_ROOM = "room";
	private static final String TOPIC_PLAYLIST = "playlist";
	private static final String TOPIC_INVITATION = "invitation";

	// Event Types
	private static final String EVENT_TYPE_ROOM_UPDATE = "room-update";
	private static final String EVENT_TYPE_ROLE_CHANGE = "role-change";
	private static final String EVENT_TYPE_USER_JOIN = "user-join";
	private static final String EVENT_TYPE_PLAYLIST_UPDATE = "playlist-update";

	public void sendRoomUpdateMessage(Object event) {
		sendEvent(TOPIC_ROOM, EVENT_TYPE_ROOM_UPDATE, event);
	}

	public void sendRoleChangeEvent(Long roomId, Long targetUserId, int newRole) {
		RoleChangeEvent event = new RoleChangeEvent(roomId, targetUserId, newRole);
		sendEvent(TOPIC_ROOM, EVENT_TYPE_ROLE_CHANGE, event);
	}

	public void sendRoomUserInfo(Long roomId, UserInfoDto userInfo) {
		NewUserJoinEvent event = new NewUserJoinEvent(roomId, userInfo);
		sendEvent(TOPIC_ROOM, EVENT_TYPE_USER_JOIN, event);
	}

	public void sendPlaylistUpdate(Long roomId, List<PlaylistItem> playlist) {
		PlaylistUpdateEvent event = new PlaylistUpdateEvent(roomId, playlist);
		sendEvent(TOPIC_PLAYLIST, EVENT_TYPE_PLAYLIST_UPDATE, event);
	}

	public void sendRoomInvitation(String invitationData) {
		kafkaTemplate.send(TOPIC_INVITATION, invitationData);
	}

	private void sendEvent(String topic, String eventType, Object eventData) {
		try {
			RoomEvent roomEvent = new RoomEvent(eventType, eventData);
			String message = objectMapper.writeValueAsString(roomEvent);
			kafkaTemplate.send(topic, message);
			log.info("Kafka Event Sent [{}]: {}", eventType, message);
		} catch (JsonProcessingException e) {
			log.error("Failed to process JSON for event [{}]: {}", eventType, e.getMessage(), e);
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}
}
