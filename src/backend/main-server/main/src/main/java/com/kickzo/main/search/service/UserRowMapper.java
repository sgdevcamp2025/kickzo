package com.kickzo.main.search.service;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.kickzo.main.entity.User;

public class UserRowMapper implements RowMapper<User> {
	@Override
	public User mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new User(
			rs.getLong("id"),
			rs.getString("nickname"),
			rs.getString("state_message"),
			rs.getString("profile_image_url")
		);
	}
}
