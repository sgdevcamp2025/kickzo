package kickzo.stomp_chat.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.ChatMessage;
import kickzo.stomp_chat.dto.InvitationData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessagingService {

	private final SimpMessagingTemplate messagingTemplate;
	private final ObjectMapper objectMapper;

	public void sendMessage(String topic, Long roomId, Object data) throws JsonProcessingException {
		String jsonResponse = objectMapper.writeValueAsString(data);
		log.info("Sending message to /topic/room/{}/{}: {}", roomId, topic, jsonResponse);
		messagingTemplate.convertAndSend("/topic/room/" + roomId + "/" + topic, jsonResponse);
	}

	public void sendInvitationMessage(Long receiverId, InvitationData invitationMessage) {
		messagingTemplate.convertAndSend("/topic/user" + receiverId + "/notification", invitationMessage);
	}

	public void sendChatMessage(Long roomId, ChatMessage chatMessage) {
		messagingTemplate.convertAndSend("/topic/room/" + roomId + "/chat", chatMessage);
	}
}
