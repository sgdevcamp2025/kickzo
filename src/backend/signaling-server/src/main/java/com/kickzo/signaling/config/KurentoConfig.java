package com.kickzo.signaling.config;

import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KurentoConfig {

	private static final String KURENTO_URI = "ws://localhost:8888/kurento";

	@Bean
	public KurentoClient kurentoClient() {
		return KurentoClient.create(KURENTO_URI);
	}
}
