package com.kickzo.main.search.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.User;
import com.kickzo.main.search.document.RoomDocument;
import com.kickzo.main.search.document.UserDocument;
import com.kickzo.main.search.repository.RoomSearchRepository;
import com.kickzo.main.search.repository.UserSearchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SearchService {
	private final UserSearchRepository userSearchRepository;
	private final RoomSearchRepository roomSearchRepository;

	public void bulkIndexUsers(List<User> users) {
		try {
			List<UserDocument> userDocuments = users.stream()
				.map(user -> new UserDocument(user.getUserId(), user.getNickname(), user.getStateMessage(), user.getProfileImageUrl()))
				.collect(Collectors.toList());

			userSearchRepository.saveAll(userDocuments);
			log.info("[bulkIndexUsers] ES에 {}명의 유저 저장 완료", userDocuments.size());
		} catch (Exception e) {
			log.error("[bulkIndexUsers] ES 저장 실패: " + e.getMessage(), e);
		}
	}

	public void indexRoom(Room room) {
		try {
			if (!room.getIsPublic()) {
				log.info("[indexRoom] 비밀방이므로 ES에 저장하지 않음: roomId = {}", room.getId());
				return;
			}
			log.info("[indexRoom] ES에 방 저장: roomId = {}, title = {}", room.getId(), room.getTitle());

			RoomDocument roomDocument = new RoomDocument();
			roomDocument.setRoomId(room.getId());
			roomDocument.setTitle(room.getTitle());
			roomDocument.setPublic(room.getIsPublic());

			roomSearchRepository.save(roomDocument);

			log.info("[indexRoom] ES에 방 저장 완료!");
		} catch (Exception e) {
			log.error("[indexRoom] 방 저장 실패: " + e.getMessage(), e);
		}
	}
}