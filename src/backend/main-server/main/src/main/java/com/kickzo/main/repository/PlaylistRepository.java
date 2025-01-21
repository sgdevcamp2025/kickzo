package com.kickzo.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kickzo.main.entity.Playlist;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
}

