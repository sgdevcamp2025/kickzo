package com.kickzo.main.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import lombok.RequiredArgsConstructor;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class ElasticsearchConfig {

	@Value("${spring.elasticsearch.uris}")
	private String elasticsearchUrl;

	@Value("${spring.elasticsearch.username}")
	private String username;

	@Value("${spring.elasticsearch.password}")
	private String password;

	@Bean
	public ElasticsearchClient elasticsearchClient() {
		// 인증 정보 제공자
		BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
		credentialsProvider.setCredentials(
			AuthScope.ANY,
			new UsernamePasswordCredentials(username, password)
		);

		// RestClient 생성
		RestClientBuilder builder = RestClient.builder(HttpHost.create(elasticsearchUrl))
			.setHttpClientConfigCallback(httpClientBuilder ->
				httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider));

		RestClient restClient = builder.build();

		// Transport + JSON Mapper 연결
		ElasticsearchTransport transport = new RestClientTransport(
			restClient, new JacksonJsonpMapper());

		return new ElasticsearchClient(transport);
	}
}