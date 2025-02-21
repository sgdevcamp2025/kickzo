package com.kickzo.main;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, Long> {
	List<UserDocument> findByNicknameContaining(String nickname);
}
