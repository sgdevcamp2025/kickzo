package com.kickzo.main.search.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.kickzo.main.search.document.RoomDocument;

@Repository
public interface RoomSearchRepository extends ElasticsearchRepository<RoomDocument, Long> {
	List<RoomDocument> findByTitleContainingAndIsPublic(String title, boolean isPublic);
}
