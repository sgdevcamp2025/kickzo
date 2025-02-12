package com.kickzo.main.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.entity.Playlist;
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

	@Transactional
	public void savePlaylist(Long roomId, List<PlaylistItem> playlistItems) {
		updateOrCreatePlaylist(roomId, playlistItems);
		kafkaProducerService.sendPlaylistUpdate(roomId, playlistItems);
	}

	private void updateOrCreatePlaylist(Long roomId, List<PlaylistItem> playlistItems) {
		Optional<Playlist> existingPlaylist = playlistRepository.findByRoomId(roomId);

		if (existingPlaylist.isPresent()) {
			updateExistingPlaylist(existingPlaylist.get(), playlistItems);
		} else {
			createNewPlaylist(roomId, playlistItems);
		}
	}

	private void updateExistingPlaylist(Playlist playlist, List<PlaylistItem> playlistItems) {
		playlist.setOrderFromList(playlistItems);
	}

	private void createNewPlaylist(Long roomId, List<PlaylistItem> playlistItems) {

		Playlist newPlaylist = new Playlist();
		newPlaylist.setRoomId(roomId);
		newPlaylist.setOrderFromList(playlistItems);
		playlistRepository.save(newPlaylist);
	}
}
