package com.kickzo.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kickzo.main.entity.Room;
import com.kickzo.main.entity.RoomUser;
import com.kickzo.main.entity.RoomUserId;

@Repository
public interface RoomUserRepository extends JpaRepository<RoomUser, RoomUserId> {
	// 내가 속한 방 보여주기
	@Query(value = "SELECT r.* "
		+ "FROM room_user ru "
		+ "JOIN room r ON ru.room_id = r.id "
		+ "WHERE ru.user_id = :userId", nativeQuery = true)
	List<Room> findRoomsByUserId(@Param("userId") Long userId);
}
