package com.kickzo.signaling.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.kurento.client.KurentoClient;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.kickzo.signaling.model.Room;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomManager {
	private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();
	private final KurentoClient kurentoClient;
	private final SimpMessagingTemplate messagingTemplate;

	public Room getRoom(String roomName) {
		log.debug("Searching for room {}", roomName);
		Room room = rooms.get(roomName);

		if (room == null) {
			log.debug("Room {} not existent. Will create now!", roomName);
			room = new Room(roomName, kurentoClient.createMediaPipeline(), messagingTemplate);
			rooms.put(roomName, room);
		}
		log.debug("Room {} found!", roomName);
		return room;
	}

	public void removeRoom(Room room) {
		this.rooms.remove(room.getRoomCode());
		room.close();
		log.info("Room {} removed and closed", room.getRoomCode());
	}
}
