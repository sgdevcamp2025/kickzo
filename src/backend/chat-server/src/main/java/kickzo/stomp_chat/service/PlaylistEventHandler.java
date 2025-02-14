package kickzo.stomp_chat.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import kickzo.stomp_chat.dto.PlaylistUpdateEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlaylistEventHandler {

	private final MessagingService messagingService;

	public void handleEvent(PlaylistUpdateEvent event) throws JsonProcessingException {
		// TODO[SMG-C]: Map 사용 보다는 Object
		// object 로 만들고 관리해야 추후에 변경 추적이 쉬워요
		Map<String, Object> playlistResponse = new LinkedHashMap<>();
		playlistResponse.put("roomId", event.getRoomId());
		playlistResponse.put("playlistJson", event.getPlaylistJson());
		messagingService.sendMessage("playlist-update", event.getRoomId(), playlistResponse);
	}
}
