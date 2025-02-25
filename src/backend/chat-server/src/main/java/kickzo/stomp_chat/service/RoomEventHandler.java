package kickzo.stomp_chat.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.room.NewUserJoinEvent;
import kickzo.stomp_chat.dto.room.RoleChangeEvent;
import kickzo.stomp_chat.dto.room.RoomData;
import kickzo.stomp_chat.dto.RoomEvent;
import kickzo.stomp_chat.dto.room.UserOutEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomEventHandler {

	private final MessagingService messagingService;
	private final ObjectMapper objectMapper;

	private static final String EVENT_ROOM_UPDATE = "room-update";
	private static final String EVENT_ROLE_CHANGE = "role-change";
	private static final String EVENT_USER_JOIN = "user-join";
	private static final String EVENT_USER_OUT = "user-out";
	private static final String MESSAGE_USER_INFO = "user-info";

	public void handleEvent(RoomEvent event) throws JsonProcessingException {
		switch (event.getEventType()) {
			case EVENT_ROOM_UPDATE:
				handleRoomUpdate(event);
				break;
			case EVENT_ROLE_CHANGE:
				handleRoleChange(event);
				break;
			case EVENT_USER_JOIN:
				handleUserJoin(event);
				break;
			case EVENT_USER_OUT:
				handleUserOut(event);
				break;
			default:
				log.warn("Unknown event type: {}", event.getEventType());
		}
	}

	private void handleRoomUpdate(RoomEvent event) throws JsonProcessingException {
		RoomData roomData = objectMapper.convertValue(event.getData(), RoomData.class);
		messagingService.sendMessage(EVENT_ROOM_UPDATE, roomData.getRoomId(), roomData);
	}

	private void handleRoleChange(RoomEvent event) throws JsonProcessingException {
		RoleChangeEvent roleChange = objectMapper.convertValue(event.getData(), RoleChangeEvent.class);
		messagingService.sendMessage(EVENT_ROLE_CHANGE, roleChange.getRoomId(), roleChange);
	}

	private void handleUserJoin(RoomEvent event) throws JsonProcessingException {
		NewUserJoinEvent userInfo = objectMapper.convertValue(event.getData(), NewUserJoinEvent.class);
		messagingService.sendMessage(MESSAGE_USER_INFO, userInfo.getRoomId(), userInfo);
	}

	private void handleUserOut(RoomEvent event) throws JsonProcessingException {
		UserOutEvent userOut = objectMapper.convertValue(event.getData(), UserOutEvent.class);
		messagingService.sendMessage(EVENT_USER_OUT, userOut.getRoomId(), userOut);
	}
}
