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
	// 내가 속한 방의 정보 보여주기
	@Query(value = "SELECT r.* "
		+ "FROM room_user ru "
		+ "JOIN room r ON ru.room_id = r.id "
		+ "WHERE ru.user_id = :userId", nativeQuery = true)
	List<Room> findRoomsByUserId(@Param("userId") Long userId);

	// 방에 속한 사용자 ID 보여주기 : List<Object[]> 형태로 반환, 배열은 [user_id, role] 형태
	@Query(value = "SELECT ru.user_id, ru.role "
		+ "FROM room_user ru "
		+ "WHERE ru.room_id = :roomId", nativeQuery = true)
	List<Object[]> findUsersByRoomId(@Param("roomId") Long roomId);

	@Query(value = "SELECT ru.role "
		+ "FROM room_user ru "
		+ "WHERE ru.room_id = :roomId AND ru.user_id = :userId", nativeQuery = true)
	Integer findRoleByUserIdAndRoomId(@Param("roomId") Long roomId, @Param("userId") Long userId);

}
