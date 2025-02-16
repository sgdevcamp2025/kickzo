package kickzo.stomp_chat.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.playlist.PlayTime;
import kickzo.stomp_chat.dto.playlist.PlaylistUpdateEvent;
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
		switch (event.getEventType()) {
			case "playlist-update":
				handlePlaylistUpdate(event);
				break;
			case "play-time":
				handlePlaylistTime(event);
				break;
			default:
				log.warn("Unknown event type: {}", event.getEventType());
		}
	}

	private void handlePlaylistUpdate(RoomEvent event) throws JsonProcessingException {
		PlaylistUpdateEvent playlistData = objectMapper.convertValue(event.getData(), PlaylistUpdateEvent.class);
		messagingService.sendMessage("playlist-update", playlistData.getRoomId(), playlistData);
	}

	private void handlePlaylistTime(RoomEvent event) throws JsonProcessingException {
		PlayTime playTimeData = objectMapper.convertValue(event.getData(), PlayTime.class);
		messagingService.sendMessage("play-time", playTimeData.getRoomId(), playTimeData);
	}
}
