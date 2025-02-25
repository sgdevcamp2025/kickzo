package com.kickzo.main.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.kickzo.main.dto.data.InvitationData;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class RedisConfig {

	@Value("${spring.data.redis.host}")
	private String host;

	@Value("${spring.data.redis.port}")
	private int port;

	@Bean
	@Primary
	public RedisConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(host, port);
		configuration.setDatabase(3);
		return new LettuceConnectionFactory(configuration);
	}

	@Bean
	public RedisConnectionFactory redisConnectionFactoryDb5() {
		RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(host, port);
		configuration.setDatabase(5); // 5번 DB (실시간 접속 관리)
		return new LettuceConnectionFactory(configuration);
	}

	@Bean
	public RedisTemplate<String, InvitationData> redisInvitationTemplate(
		@Qualifier("redisConnectionFactory") RedisConnectionFactory connectionFactory) {
		RedisTemplate<String, InvitationData> template = new RedisTemplate<>();
		template.setConnectionFactory(connectionFactory);

		// Key는 String 직렬화
		template.setKeySerializer(new StringRedisSerializer());

		// 커스텀 ObjectMapper 설정
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
		objectMapper.activateDefaultTyping(
			LaissezFaireSubTypeValidator.instance,
			ObjectMapper.DefaultTyping.NON_FINAL,
			JsonTypeInfo.As.PROPERTY
		);

		// Value는 InvitationData로 직렬화 및 역직렬화
		Jackson2JsonRedisSerializer<InvitationData> serializer = new Jackson2JsonRedisSerializer<>(InvitationData.class);
		template.setValueSerializer(serializer);

		template.afterPropertiesSet();
		return template;
	}

	// 5번 DB용 RedisTemplate (실시간 접속 관리)
	@Bean(name = "redisActiveUsersTemplate")
	public RedisTemplate<String, String> redisActiveUsersTemplate(@Qualifier("redisConnectionFactoryDb5") RedisConnectionFactory redisConnectionFactoryDb5) {
		log.info("🚀 Initializing redisActiveUsersTemplate with Redis DB: {}",
			((LettuceConnectionFactory) redisConnectionFactoryDb5).getDatabase());
		RedisTemplate<String, String> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactoryDb5);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new StringRedisSerializer());
		template.afterPropertiesSet();
		return template;
	}
}
