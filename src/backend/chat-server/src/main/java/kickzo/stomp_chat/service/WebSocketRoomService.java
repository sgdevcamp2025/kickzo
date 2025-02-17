package kickzo.stomp_chat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kickzo.stomp_chat.dto.room.ChatMessage;
import kickzo.stomp_chat.dto.user.ConnectionEvent;
import kickzo.stomp_chat.dto.playlist.PlayTime;
import kickzo.stomp_chat.dto.RoomEvent;
import kickzo.stomp_chat.enums.EventType;
import kickzo.stomp_chat.repository.KafkaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketRoomService {

	private final KafkaRepository kafkaRepository;

	@Value("${server.port}")  // 현재 서버 포트 번호 주입
	private String serverPort;

	/**
	 * 특정 페이지에서 사용자 제거
	 */
	public void leavePage(long userId) {
		log.info("User {} leave service", userId);
		sendConnection(userId, EventType.LEAVE);
	}

	/**
	 * 방에 메시지 전송
	 */
	public void handleMessageSend(long roomId, long userId, String content, String msg) {
		ChatMessage chatMessage = new ChatMessage(roomId, userId, content, msg);
		kafkaRepository.sendChatMessage(chatMessage);
	}

	/**
	 * Kafka에 사용자 연결 상태 전송
	 */
	public void sendConnection(long userId, EventType eventType) {
		ConnectionEvent event = new ConnectionEvent(userId, eventType, serverPort);
		kafkaRepository.sendConnectionEvent(event);
	}

	/**
	 * Kafka에 playlistTime 전송
	 */
	public void sendPlayTime (long roomId, long playTime, String playerState){
		PlayTime playTimeObject = new PlayTime(roomId, playTime, playerState);

		RoomEvent roomEvent = new RoomEvent("play-time", playTimeObject);
		kafkaRepository.sendPlayTime(roomEvent);
	}
}
