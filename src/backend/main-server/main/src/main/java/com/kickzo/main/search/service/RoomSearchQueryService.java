package com.kickzo.main.search.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.kickzo.main.search.document.RoomDocument;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomSearchQueryService {

	private final ElasticsearchClient elasticsearchClient;

	public List<RoomDocument> search(String keyword) {
		try {
			SearchResponse<RoomDocument> response = elasticsearchClient.search(s -> s
					.index("room")
					.query(q -> q
						.multiMatch(m -> m
							.fields("title")
							.query(keyword)
							.fuzziness("AUTO")
						)
					)
					.size(20),
				RoomDocument.class
			);

			return response.hits().hits().stream()
				.map(Hit::source)
				.collect(Collectors.toList());

		} catch (IOException e) {
			throw new RuntimeException("검색 실패", e);
		}
	}
}
