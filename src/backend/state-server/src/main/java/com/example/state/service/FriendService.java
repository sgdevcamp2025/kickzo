package com.example.state.service;

import com.example.state.repository.FriendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepository friendRepository;

    // userId를 Long 타입으로 변경
    public List<Long> getFriends(Long userId) {
        // friendRepository에서 반환되는 friendIds도 Long 타입으로 변경
        return friendRepository.findFriendsByUserId(userId);
    }
}
