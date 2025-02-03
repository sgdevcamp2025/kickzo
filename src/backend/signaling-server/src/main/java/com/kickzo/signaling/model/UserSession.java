package com.kickzo.signaling.model;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.kurento.client.Continuation;
import org.kurento.client.IceCandidate;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.jsonrpc.JsonUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.google.gson.JsonObject;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
public class UserSession {
	private final String name;
	private final String sessionId;
	private final String roomCode;
	private final SimpMessagingTemplate messagingTemplate;
	private final MediaPipeline pipeline;
	private final WebRtcEndpoint outgoingMedia;
	private final ConcurrentMap<String, WebRtcEndpoint> incomingMedia = new ConcurrentHashMap<>();

	public UserSession(final String name, final String roomCode, final String sessionId, MediaPipeline pipeline,
		SimpMessagingTemplate messagingTemplate) {
		this.name = name;
		this.sessionId = sessionId;
		this.roomCode = roomCode;
		this.pipeline = pipeline;
		this.outgoingMedia = new WebRtcEndpoint.Builder(pipeline).build();
		this.messagingTemplate = messagingTemplate;

		this.outgoingMedia.addIceCandidateFoundListener(event -> {
			JsonObject response = new JsonObject();
			response.addProperty("id", "iceCandidate");
			response.addProperty("name", name);
			response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));

			sendMessage(response);
		});
		log.info("✅ Created user session");
	}

	public void receiveAudioFrom(UserSession sender, String sdpOffer) {
		log.info("USER {}: connecting with {} in room {}", this.name, sender.getName(), this.roomCode);

		log.trace("USER {}: SdpOffer for {} is {}", this.name, sender.getName(), sdpOffer);

		final String ipSdpAnswer = this.getEndpointForUser(sender).processOffer(sdpOffer);

		JsonObject response = new JsonObject();
		response.addProperty("id", "receiveAudioAnswer");
		response.addProperty("name", sender.getName());
		response.addProperty("room", roomCode);
		response.addProperty("sdpAnswer", ipSdpAnswer);

		log.trace("USER {}: SdpAnswer for {} is {}", this.name, sender.getName(), ipSdpAnswer);
		this.sendMessage(response);

		this.getEndpointForUser(sender).gatherCandidates();
	}

	public void addCandidate(IceCandidate candidate, String name) {
		if (this.name.compareTo(name) == 0) {
			outgoingMedia.addIceCandidate(candidate);
		} else {
			WebRtcEndpoint webRtc = incomingMedia.get(name);
			if (webRtc != null) {
				webRtc.addIceCandidate(candidate);
			}
		}
	}

	public void cancelAudioFrom(String senderName) {
		log.debug("PARTICIPANT {}: canceling video reception from {}", this.name, senderName);
		final WebRtcEndpoint incoming = incomingMedia.remove(senderName);

		if (incoming == null) {
			log.warn("PARTICIPANT {}: No WebRtcEndpoint found for sender {}", this.name, senderName);
			return; // 오류 추가
		}

		log.debug("PARTICIPANT {}: removing endpoint for {}", this.name, senderName);
		incoming.release(new Continuation<Void>() {
			@Override
			public void onSuccess(Void result) {
				log.trace("PARTICIPANT {}: Released successfully incoming EP for {}",
					UserSession.this.name, senderName);
			}

			@Override
			public void onError(Throwable cause) {
				log.warn("PARTICIPANT {}: Could not release incoming EP for {}", UserSession.this.name, senderName);
			}
		});
	}

	public void sendMessage(JsonObject message) {
		log.debug("USER {}: Sending STOMP message {}", name, message);

		// 메시지를 방의 모든 참가자에게 전송
		messagingTemplate.convertAndSend("/topic/room/" + roomCode, message.toString());
	}

	public void close() {
		outgoingMedia.release();
		incomingMedia.values().forEach(WebRtcEndpoint::release);
		incomingMedia.clear();
	}

	private WebRtcEndpoint getEndpointForUser(final UserSession sender) {
		if (sender.getName().equals(name)) {
			log.debug("PARTICIPANT {}: configuring loopback", this.name);
			return outgoingMedia;
		}
		log.debug("PARTICIPANT {}: receiving video from {}", this.name, sender.getName());

		WebRtcEndpoint incoming = incomingMedia.get(sender.getName());
		if (incoming == null) {
			log.debug("PARTICIPANT {}: creating new endpoint for {}", this.name, sender.getName());
			incoming = new WebRtcEndpoint.Builder(pipeline).build();

			incoming.addIceCandidateFoundListener(event -> {
				JsonObject response = new JsonObject();
				response.addProperty("id", "iceCandidate");
				response.addProperty("name", sender.getName());
				response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
				sendMessage(response);
			});
			incomingMedia.put(sender.getName(), incoming);
		}
		log.debug("PARTICIPANT {}: obtained endpoint for {}", this.name, sender.getName());
		sender.getOutgoingMedia().connect(incoming);

		return incoming;
	}
}
