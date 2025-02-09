package com.kickzo.main.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
	@Bean
	public OpenAPI customOpenApi() {
		return new OpenAPI()
			.info(new Info()
				.title("Kickzo API Documentation")
				.description("Kickzo API 문서입니다."));
	}
}