package com.kickzo.main.search.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.User;
import com.kickzo.main.search.document.RoomDocument;
import com.kickzo.main.search.document.UserDocument;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkResponseItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SearchService {
	private final ElasticsearchClient elasticsearchClient;
	private final UserSearchQueryService userSearchQueryService;
	private final RoomSearchQueryService roomSearchQueryService;

	public List<UserResponseDto> searchUsers(String keyword) {
		List<UserDocument> users = userSearchQueryService.search(keyword);
		return users.stream()
			.map(user -> new UserResponseDto(
				user.getUserId(),
				user.getNickname(),
				user.getStateMessage(),
				user.getProfileImageUrl()
			))
			.collect(Collectors.toList());
	}

	public void bulkIndexUsers(List<User> users) {
		try {
			BulkRequest.Builder br = new BulkRequest.Builder();

			for (User user : users) {
				UserDocument doc = new UserDocument(user.getUserId(), user.getNickname(), user.getStateMessage(), user.getProfileImageUrl());
				br.operations(op -> op
					.index(idx -> idx
						.index("user")
						.id(String.valueOf(doc.getUserId()))
						.document(doc)
					)
				);
			}

			BulkResponse result = elasticsearchClient.bulk(br.build());

			if (result.errors()) {
				log.warn("[bulkIndexUsers] 일부 문서 저장 실패: {}", result.items().stream()
					.map(BulkResponseItem::error)
					.toList());
			} else {
				log.info("[bulkIndexUsers] ES에 {}명의 유저 저장 완료", users.size());
			}
		} catch (Exception e) {
			log.error("[bulkIndexUsers] ES 저장 실패: {}", e.getMessage(), e);
		}
	}

	public List<RoomResponseDto> searchRooms(String keyword) {
		List<RoomDocument> rooms = roomSearchQueryService.search(keyword);
		return rooms.stream()
			.map(room -> new RoomResponseDto(
				room.getRoomId(),
				room.getTitle(),
				room.isPublic()
			)).collect(Collectors.toList());
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

			IndexRequest<RoomDocument> request = new IndexRequest.Builder<RoomDocument>()
				.index("room")
				.id(String.valueOf(roomDocument.getRoomId()))
				.document(roomDocument)
				.build();

			IndexResponse response = elasticsearchClient.index(request);
			log.info("[indexRoom] ES에 방 저장 완료!");
		} catch (Exception e) {
			log.error("[indexRoom] 방 저장 실패: " + e.getMessage(), e);
		}
	}

	private record UserResponseDto(Long userId, String nickname, String stateMessage, String profileImageUrl) {}
	private record RoomResponseDto(Long roomId, String title, boolean isPublic) {}
}