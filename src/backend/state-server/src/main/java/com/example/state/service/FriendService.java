package com.example.state.service;

import com.example.state.repository.FriendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepository friendRepository;

    public List<String> getFriends(String userId) {
        List<Long> friendIds = friendRepository.findFriendsByUserId(Long.parseLong(userId));
        return friendIds.stream().map(String::valueOf).collect(Collectors.toList());
    }
}
