package com.example.state.config;

import com.example.state.service.StateManager;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.MessageListener;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    private final StateManager stateManager;

    @Value("${server.port}")
    private String serverPort;

    @Value("${spring.kafka.bootstrap-servers}")
    private String KAFKA_BROKER;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    // StateManager 서비스 주입
    public KafkaConsumerConfig(StateManager stateManager) {
        this.stateManager = stateManager;
    }

    // 서버 포트에 맞춰서 groupId를 동적으로 설정하는 메서드
    @PostConstruct
    public void init() {
        groupId = "my-group-" + serverPort; // 서버 포트에 따라 groupId 설정
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {

        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA_BROKER);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(configProps);
    }

    @Bean
    public ConcurrentMessageListenerContainer<String, String> messageListenerContainer() {
        MessageListener<String, String> messageListener = new MessageListener<String, String>() {
            @Override
            public void onMessage(ConsumerRecord<String, String> record) {
                String message = record.value();
                System.out.println("Received Kafka message: " + message);

                // 상태 관리 처리
                stateManager.consumeMessage(message);
            }
        };

        ContainerProperties containerProps = new ContainerProperties("connection");
        containerProps.setMessageListener(messageListener);
        containerProps.setGroupId(groupId); // groupId 설정

        return new ConcurrentMessageListenerContainer<>(consumerFactory(), containerProps);
    }
}
