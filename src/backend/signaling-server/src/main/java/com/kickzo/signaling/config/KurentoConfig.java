package com.kickzo.signaling.config;

import org.kurento.client.KurentoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KurentoConfig {

	@Value("${KURENTO_URI}")  // 환경 변수에서 KMS 주소 가져오기
	private String kurentoUri;

	@Bean
	public KurentoClient kurentoClient() {
		return KurentoClient.create(kurentoUri);
	}
}
