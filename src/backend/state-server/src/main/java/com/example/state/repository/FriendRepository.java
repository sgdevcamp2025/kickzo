package com.example.state.repository;

import com.example.state.entity.Friend;
import com.example.state.entity.FriendId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, FriendId> {

    @Query("SELECT CASE " +
            "WHEN f.friend1 = :userId THEN f.friend2 " +
            "WHEN f.friend2 = :userId THEN f.friend1 " +
            "END " +
            "FROM Friend f WHERE f.friend1 = :userId OR f.friend2 = :userId")
    List<Long> findFriendsByUserId(Long userId);
}
