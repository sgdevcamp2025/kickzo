package com.kickzo.main.search.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.kickzo.main.search.document.UserDocument;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSearchQueryService {

	private final ElasticsearchClient elasticsearchClient;

	public List<UserDocument> search(String keyword) {
		try {
			SearchResponse<UserDocument> response = elasticsearchClient.search(s -> s
					.index("user")
					.query(q -> q
						.multiMatch(m -> m
							.fields("nickname")
							.query(keyword)
							.fuzziness("AUTO")
						)
					)
					.size(20),
				UserDocument.class
			);

			return response.hits().hits().stream()
				.map(Hit::source)
				.collect(Collectors.toList());

		} catch (IOException e) {
			throw new RuntimeException("검색 실패", e);
		}
	}
}

