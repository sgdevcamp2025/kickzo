package com.kickzo.signaling.service;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.kickzo.signaling.model.UserSession;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserSessionManager {

	private final ConcurrentHashMap<String, UserSession> usersByName = new ConcurrentHashMap<>();
	private final ConcurrentHashMap<String, UserSession> usersBySessionId = new ConcurrentHashMap<>();

	public void register(UserSession user) {
		log.info("✅ Registering user: {} with sessionId: {}", user.getName(), user.getSessionId());
		usersBySessionId.put(user.getSessionId(), user);
		usersByName.put(user.getName(), user);
	}

	public UserSession getByName(String name) {
		return usersByName.get(name);
	}

	public UserSession getBySessionId(String sessionId) {
		return usersBySessionId.get(sessionId);
	}

	public UserSession removeBySessionId(String sessionId) {
		final UserSession user = getBySessionId(sessionId);
		usersByName.remove(user.getName());
		usersBySessionId.remove(sessionId);
		return user;
	}
}

