package com.example.state.service;

import com.example.state.dto.UserStatusUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    // TODO[SMG-C]: 네이밍 변경
    // Service/Repository 계층으로 사용중이시면 kafka는 인프라 계층이고, 이를 활용하는 역할이라 KafkaRepository로 보는게 맞을거 같아요
    // 참고 : https://medium.com/@ankitpal181/service-repository-pattern-802540254019

    private final KafkaTemplate<String, UserStatusUpdateDto> userStatusKafkaTemplate;

    private static final String TOPIC = "friend_online_notify";

    public void sendUserStatus(UserStatusUpdateDto userStatusUpdateDto) {
        userStatusKafkaTemplate.send(TOPIC, userStatusUpdateDto);
    }
}
