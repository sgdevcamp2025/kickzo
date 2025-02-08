package com.kickzo.main.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.event.PlaylistItem;
import com.kickzo.main.entity.Playlist;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;
import com.kickzo.main.repository.PlaylistRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlaylistService {

	private final PlaylistRepository playlistRepository;
	private final KafkaProducerService kafkaProducerService;
	private final ObjectMapper objectMapper;

	@Transactional
	public void savePlaylist(Long roomId, String playlistJson) {
		List<PlaylistItem> playlistItems = parsePlaylistJson(playlistJson);
		updateOrCreatePlaylist(roomId, playlistJson);
		kafkaProducerService.sendPlaylistUpdate(roomId, playlistItems);
	}

	private List<PlaylistItem> parsePlaylistJson(String playlistJson) {
		try {
			return objectMapper.readValue(playlistJson, new TypeReference<List<PlaylistItem>>() {});
		} catch (JsonProcessingException e) {
			log.error("Failed to parse playlist JSON: {}", playlistJson, e);
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}

	private void updateOrCreatePlaylist(Long roomId, String playlistJson) {
		Optional<Playlist> existingPlaylist = playlistRepository.findByRoomId(roomId);

		if (existingPlaylist.isPresent()) {
			updateExistingPlaylist(existingPlaylist.get(), playlistJson);
		} else {
			createNewPlaylist(roomId, playlistJson);
		}
	}

	private void updateExistingPlaylist(Playlist playlist, String playlistJson) {
		playlist.setOrder(playlistJson);
	}

	private void createNewPlaylist(Long roomId, String playlistJson) {
		Playlist newPlaylist = new Playlist();
		newPlaylist.setRoomId(roomId);
		newPlaylist.setOrder(playlistJson);
		playlistRepository.save(newPlaylist);
	}
}
