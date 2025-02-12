package com.example.state.service;

import com.example.state.dto.UserStatusUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private final KafkaTemplate<String, UserStatusUpdateDto> userStatusKafkaTemplate;

    private static final String TOPIC = "friend_online_notify";

    public void sendUserStatus(UserStatusUpdateDto userStatusUpdateDto) {
        userStatusKafkaTemplate.send(TOPIC, userStatusUpdateDto);
    }
}
