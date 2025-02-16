package kickzo.stomp_chat.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.room.NewUserJoinEvent;
import kickzo.stomp_chat.dto.room.RoleChangeEvent;
import kickzo.stomp_chat.dto.room.RoomData;
import kickzo.stomp_chat.dto.RoomEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomEventHandler {

	private final MessagingService messagingService;
	private final ObjectMapper objectMapper;

	public void handleEvent(RoomEvent event) throws JsonProcessingException {
		switch (event.getEventType()) {
			case "room-update":
				handleRoomUpdate(event);
				break;
			case "role-change":
				handleRoleChange(event);
				break;
			case "user-join":
				handleUserJoin(event);
				break;
			default:
				log.warn("Unknown event type: {}", event.getEventType());
		}
	}

	private void handleRoomUpdate(RoomEvent event) throws JsonProcessingException {
		RoomData roomData = objectMapper.convertValue(event.getData(), RoomData.class);
		messagingService.sendMessage("room-update", roomData.getRoomId(), roomData);
	}

	private void handleRoleChange(RoomEvent event) throws JsonProcessingException {
		RoleChangeEvent roleChange = objectMapper.convertValue(event.getData(), RoleChangeEvent.class);
		messagingService.sendMessage("role-change", roleChange.getRoomId(), roleChange);
	}

	private void handleUserJoin(RoomEvent event) throws JsonProcessingException {
		NewUserJoinEvent userInfo = objectMapper.convertValue(event.getData(), NewUserJoinEvent.class);
		messagingService.sendMessage("user-info", userInfo.getRoomId(), userInfo);
	}
}