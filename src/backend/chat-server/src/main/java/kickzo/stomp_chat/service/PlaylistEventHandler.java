package kickzo.stomp_chat.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.PlaylistUpdateEvent;
import kickzo.stomp_chat.dto.RoomEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlaylistEventHandler {

	private final MessagingService messagingService;
	private final ObjectMapper objectMapper;

	public void handleEvent(RoomEvent event) throws JsonProcessingException {
		PlaylistUpdateEvent playlistData = objectMapper.convertValue(event.getData(), PlaylistUpdateEvent.class);
		messagingService.sendMessage("playlist-update", playlistData.getRoomId(), playlistData);
	}
}
