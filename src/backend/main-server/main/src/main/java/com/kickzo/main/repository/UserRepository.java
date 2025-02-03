package com.kickzo.main.repository;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepository {
	private final NamedParameterJdbcTemplate jdbcTemplate;

	public String findNicknameById(Long userId) {
		String sql = "SELECT u.nickname FROM user u WHERE u.id = :userId";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("userId", userId);
		return jdbcTemplate.queryForObject(sql, params, String.class);
	}

	public String findProfileImageUrlByNickname(String nickname) {
		String sql = "SELECT u.profile_image_url FROM user u WHERE u.nickname = :nickname";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("nickname", nickname);
		return jdbcTemplate.queryForObject(sql, params, String.class);
	}
}
