package com.kickzo.signaling.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kickzo.signaling.repository.RedisRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/signal")
@RequiredArgsConstructor
public class VoiceChatController {
	private final RedisRepository redisRepository;

	@PostMapping("/participants/{roomId}")
	public ResponseEntity<String> addUser(@PathVariable String roomId, @RequestParam String userId) {
		try {
			redisRepository.addUserToRoom(roomId, userId);
			return ResponseEntity.ok("User added successfully");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/participants/{roomId}")
	public ResponseEntity<Set<String>> getVoiceChatParticipants(@PathVariable String roomId) {
		Set<String> userList = redisRepository.getUsersInRoom(roomId);
		return ResponseEntity.ok(userList);
	}
}