package com.kickzo.signaling.model;

import java.io.Closeable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.annotation.PreDestroy;

import org.kurento.client.Continuation;
import org.kurento.client.MediaPipeline;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import lombok.Getter;

public class Room implements Closeable {
	private final Logger log = LoggerFactory.getLogger(Room.class);

	@Getter
	private final String roomCode;
	private final MediaPipeline pipeline;
	private final SimpMessagingTemplate messagingTemplate;
	private final ConcurrentMap<String, UserSession> participants = new ConcurrentHashMap<>();

	public Room(String roomName, MediaPipeline pipeline, SimpMessagingTemplate messagingTemplate) {
		this.roomCode = roomName;
		this.pipeline = pipeline;
		this.messagingTemplate = messagingTemplate;
		log.info("ROOM {} has been created", roomName);
	}

	@PreDestroy
	private void shutdown() {
		this.close();
	}

	public Collection<UserSession> getParticipants() {
		return participants.values(); //.get(name)
	}

	public UserSession join(String userName, String sessionId) {
		log.info("ROOM {}: adding participant {}", this.roomCode, userName);
		final UserSession participant = new UserSession(userName, this.roomCode, sessionId, this.pipeline,
			this.messagingTemplate);
		joinRoom(participant);
		participants.put(participant.getName(), participant);
		sendParticipantNames(participant);
		return participant;
	}

	public void sendParticipantNames(UserSession user) {
		final JsonArray participantsArray = new JsonArray();

		for (final UserSession participant : this.getParticipants()) {
			if (!participant.equals(user)) {
				final JsonElement participantName = new JsonPrimitive(participant.getName());
				participantsArray.add(participantName);
			}
		}

		final JsonObject existingParticipantsMsg = new JsonObject();
		existingParticipantsMsg.addProperty("id", "existingParticipants");
		existingParticipantsMsg.add("data", participantsArray);
		log.debug("PARTICIPANT {}: sending a list of {} participants", user.getName(),
			participantsArray.size());
		user.sendMessage(existingParticipantsMsg);
	}

	public void leave(UserSession userSession) {
		log.debug("PARTICIPANT {}: Leaving room {}", userSession.getName(), this.roomCode);
		this.removeParticipant(userSession.getName());
		userSession.close();
	}

	@Override
	public void close() {
		for (final UserSession user : participants.values()) {
			user.close();
		}

		participants.clear();

		pipeline.release(new Continuation<Void>() {

			@Override
			public void onSuccess(Void result) {
				log.trace("ROOM {}: Released Pipeline", Room.this.roomCode);
			}

			@Override
			public void onError(Throwable cause) {
				log.warn("PARTICIPANT {}: Could not release Pipeline", Room.this.roomCode);
			}
		});

		log.debug("Room {} closed", this.roomCode);
	}

	private Collection<String> joinRoom(UserSession newParticipant) {
		final JsonObject newParticipantMsg = new JsonObject();
		newParticipantMsg.addProperty("id", "newParticipantArrived");
		newParticipantMsg.addProperty("name", newParticipant.getName());

		final List<String> participantsList = new ArrayList<>(participants.values().size());
		log.debug("ROOM {}: notifying other participants of new participant {}", roomCode,
			newParticipant.getName());

		for (final UserSession participant : participants.values()) {
			participant.sendMessage(newParticipantMsg);
			participantsList.add(participant.getName());
		}

		return participantsList;
	}

	private void removeParticipant(String name) {
		participants.remove(name);

		log.debug("ROOM {}: notifying all users that {} is leaving the room", this.roomCode, name);

		final JsonObject participantLeftJson = new JsonObject();
		participantLeftJson.addProperty("id", "participantLeft");
		participantLeftJson.addProperty("name", name);
		for (final UserSession participant : participants.values()) {
			if (participant != null) {
				participant.cancelAudioFrom(name);
				participant.sendMessage(participantLeftJson);
			} else {
				log.warn("ROOM {}: Tried to notify a null participant about {} leaving", this.roomCode, name);
			}
		}
	}
}
