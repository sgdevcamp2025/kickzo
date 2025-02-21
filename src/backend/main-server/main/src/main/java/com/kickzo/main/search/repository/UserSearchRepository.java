package com.kickzo.main.search.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.kickzo.main.search.document.UserDocument;

@Repository
public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, Long> {
	List<UserDocument> findByNicknameContaining(String nickname);
}
