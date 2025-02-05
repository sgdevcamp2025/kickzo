package com.kickzo.main.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kickzo.main.entity.Playlist;
import com.kickzo.main.repository.PlaylistRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaylistService {

	private final PlaylistRepository playlistRepository;
	private final KafkaProducerService kafkaProducerService;

	@Transactional
	public void savePlaylist(Long roomId, String playlistJson) {
		// playlist 테이블에 roomId에 해당하는 방이 있는 지 확인
		Optional<Playlist> existingPlaylist = playlistRepository.findByRoomId(roomId);
		// 있는 경우 playlist 수정
		if (existingPlaylist.isPresent()) {
			Playlist playlist = existingPlaylist.get();
			playlist.setOrder(playlistJson);
		} else {
			// 없는 경우 새롭게 추가
			Playlist newPlaylist = new Playlist();
			newPlaylist.setRoomId(roomId);
			newPlaylist.setOrder(playlistJson);
			playlistRepository.save(newPlaylist);
		}
		kafkaProducerService.sendPlaylistUpdate(roomId, playlistJson);
	}
}
