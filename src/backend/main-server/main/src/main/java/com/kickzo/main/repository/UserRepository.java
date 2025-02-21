package com.kickzo.main.repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.kickzo.main.entity.User;
import com.kickzo.main.search.service.UserRowMapper;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepository {
	private final NamedParameterJdbcTemplate jdbcTemplate;

	public String findNicknameById(Long userId) {
		String sql = "SELECT u.nickname FROM user u WHERE u.id = :userId";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("userId", userId);
		try {
			return jdbcTemplate.queryForObject(sql, params, String.class);
		} catch (EmptyResultDataAccessException e) {
			throw new CustomException(CustomErrorCode.USER_NOT_FOUND);
		}
	}

	public String findProfileImageUrlByNickname(String nickname) {
		String sql = "SELECT u.profile_image_url FROM user u WHERE u.nickname = :nickname";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("nickname", nickname);
		try {
			return jdbcTemplate.queryForObject(sql, params, String.class);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	public String findProfileImageUrlById(Long userId) {
		String sql = "SELECT u.profile_image_url FROM user u WHERE u.id = :userId";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("userId", userId);
		try {
			return jdbcTemplate.queryForObject(sql, params, String.class);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	public List<User> findUpdatedUsers(LocalDateTime lastSyncTime) {
		String sql = "SELECT u.id, u.nickname, u.state_message, u.profile_image_url FROM user u WHERE u.nickname_updated_at >= :nickname_updated_at";
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("nickname_updated_at", Timestamp.valueOf(lastSyncTime));
		return jdbcTemplate.query(sql, params, new UserRowMapper());
	}
}
