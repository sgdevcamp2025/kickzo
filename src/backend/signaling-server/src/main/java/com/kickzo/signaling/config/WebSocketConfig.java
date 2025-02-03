package com.kickzo.signaling.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 메시지 브로커 구성
		registry.enableSimpleBroker("/topic"); // 브로커 경로
		registry.setApplicationDestinationPrefixes("/app"); // 클라이언트 요청 경로
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// STOMP 엔드포인트 등록
		registry.addEndpoint("/group-call")
			.setAllowedOriginPatterns("*")
			.withSockJS();
	}
}
