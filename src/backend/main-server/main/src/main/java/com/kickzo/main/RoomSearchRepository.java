package com.kickzo.main;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomSearchRepository extends ElasticsearchRepository<RoomDocument, Long> {
	List<RoomDocument> findByTitleContainingAndIsPublic(String title, boolean isPublic);
}
