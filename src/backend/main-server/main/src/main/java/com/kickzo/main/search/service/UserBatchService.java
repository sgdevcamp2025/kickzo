package com.kickzo.main.search.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.kickzo.main.entity.User;
import com.kickzo.main.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserBatchService {
	private final UserRepository userRepository;
	private final SearchService searchService;

	private LocalDateTime lastSyncTime = LocalDateTime.now(ZoneOffset.UTC).minusMinutes(10);

	@Scheduled(fixedRate = 300000) // 5분마다 실행 (10분 = 600000ms)
	public void syncUsersToElasticsearch() {
		// lastSyncTime이 NULL이면 초기값을 UTC로 설정 (중복 변환 방지)
		if (lastSyncTime == null) {
			lastSyncTime = LocalDateTime.now(ZoneOffset.UTC);
		}

		log.info("[syncUsersToElasticsearch] 실행됨! lastSyncTime (UTC 변환) = {}", lastSyncTime);
		try {
			List<User> updatedUsers = userRepository.findUpdatedUsers(lastSyncTime);
			log.info("[syncUsersToElasticsearch] 업데이트된 유저 개수: " + updatedUsers.size());
			if (!updatedUsers.isEmpty()) {
				// 새로운 lastSyncTime을 UTC 기준으로 설정
				lastSyncTime = LocalDateTime.now(ZoneOffset.UTC);
				searchService.bulkIndexUsers(updatedUsers);
				lastSyncTime = LocalDateTime.now(ZoneOffset.UTC);
			}
		} catch (Exception e) {
			log.error("Elasticsearch 동기화 오류: " + e.getMessage());
		}
	}
}
