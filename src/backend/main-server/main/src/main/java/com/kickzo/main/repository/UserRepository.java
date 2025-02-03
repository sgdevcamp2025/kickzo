package com.kickzo.main.repository;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
	private final NamedParameterJdbcTemplate jdbcTemplate;

	public UserRepository(NamedParameterJdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public String findNicknameById(Long userId) {
		String sql = "SELECT u.nickname FROM user u WHERE u.id = :userId";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("userId", userId);
		return jdbcTemplate.queryForObject(sql, params, String.class);
	}
}
