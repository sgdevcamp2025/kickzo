package com.kickzo.main.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kickzo.main.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
	// 메인 페이지에 제공하는 방
	@Query("SELECT r FROM Room r LEFT JOIN FETCH r.playlist WHERE r.userCount > 0 ORDER BY r.userCount DESC")
	List<Room> findAllByUserCountDesc(Pageable pageable);
}

