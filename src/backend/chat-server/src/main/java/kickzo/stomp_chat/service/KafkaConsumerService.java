package kickzo.stomp_chat.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kickzo.stomp_chat.dto.ChatMessage;
import kickzo.stomp_chat.dto.FriendNotification;
import kickzo.stomp_chat.dto.InvitationData;
import kickzo.stomp_chat.dto.RoomEvent;
import kickzo.stomp_chat.dto.UserStatusEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

	private final ObjectMapper objectMapper;
	private final RoomEventHandler roomEventHandler;
	private final PlaylistEventHandler playlistEventHandler;
	private final MessagingService messagingService;

	@KafkaListener(topics = "playlist")
	public void consumePlaylistEvents(ConsumerRecord<String, String> record) {
		try {
			RoomEvent event = objectMapper.readValue(record.value(), RoomEvent.class);
			log.info("Received Playlist Update Event: {}", event);
			playlistEventHandler.handleEvent(event);
		} catch (Exception e) {
			log.error("Error processing playlist event", e);
		}
	}

	@KafkaListener(topics = "room")
	public void consumeRoomEvents(ConsumerRecord<String, String> record) {
		try {
			RoomEvent event = objectMapper.readValue(record.value(), RoomEvent.class);
			log.info("Received Room Event: {}", event);
			roomEventHandler.handleEvent(event);
		} catch (Exception e) {
			log.error("Error processing room event", e);
		}
	}

	@KafkaListener(topics = "invitation")
	public void consumeInvitationEvents(String invitationMessage) {
		try {
			InvitationData message = objectMapper.readValue(invitationMessage, InvitationData.class);
			processInvitationMessage(message);
		} catch (Exception e) {
			log.error("Error processing Kafka message", e);
		}
	}

	private void processInvitationMessage(InvitationData message) throws JsonProcessingException {
		Long receiverId = message.getReceiverId();
		messagingService.sendUserMessage("notification", receiverId, message);
		log.info("Sent notification to user {}: {}", receiverId, message);
	}

	@KafkaListener(topics = "chatting")
	public void consumeChattingEvents(ConsumerRecord<String, String> record) {
		try {
			ChatMessage chatMessage = objectMapper.readValue(record.value(), ChatMessage.class);
			log.info("Received Chat Message: {}", chatMessage);
			sendChatMessageToWebSocket(chatMessage);
		} catch (Exception e) {
			log.error("Error processing Kafka message", e);
		}
	}

	private void sendChatMessageToWebSocket(ChatMessage chatMessage) {
		Long roomId = chatMessage.roomId();
		messagingService.sendChatMessage(roomId, chatMessage);
		log.info("Sent Chat Message: {}", chatMessage);
	}

	@KafkaListener(topics = "friend_online_notify")
	public void consumeFriendOnlineNotifyEvents(ConsumerRecord<String, String> record) {
		try {
			UserStatusEvent userStatusEvent = objectMapper.readValue(record.value(), UserStatusEvent.class);
			notifyFriends(userStatusEvent);
		} catch (JsonProcessingException e) {
			log.error("Error processing Kafka message", e);
		}
	}

	private void notifyFriends(UserStatusEvent userStatusEvent) {
		long userId = userStatusEvent.getUserId();
		String status = userStatusEvent.getStatus();

		FriendNotification friendStatus = new FriendNotification(userId, status);

		userStatusEvent.getFriends().forEach(friendId -> {
			try {
				messagingService.sendUserMessage("friend-state", friendId, friendStatus);
			} catch (JsonProcessingException e) {
				throw new RuntimeException(e);
			}
		});
	}
}
