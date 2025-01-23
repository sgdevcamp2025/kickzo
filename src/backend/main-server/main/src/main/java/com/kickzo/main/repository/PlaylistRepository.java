package com.kickzo.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kickzo.main.dto.PlaylistDto;
import com.kickzo.main.entity.Playlist;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
	@Query(value = "SELECT p.order FROM playlist p WHERE p.room_id = :roomId", nativeQuery = true)
	List<PlaylistDto> findOrderById(@Param("roomId") Long roomId);
}

