package history.kickzo.config;

import history.kickzo.model.ChatMessage;
import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.MessageListener;

import history.kickzo.model.ChatMessage;
import history.kickzo.service.ChatMessageService;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Value("${server.port}")
    private String serverPort;

    @Value("${spring.kafka.bootstrap-servers}")
    private String KAFKA_BROKER; // Kafka 브로커 주소 // Kafka broker 주소

    @Value(("${spring.kafka.consumer.group-id}"))
    private String groupId;

    // 서버 포트에 맞춰서 groupId를 동적으로 설정하는 메서드
    @PostConstruct
    public void init() {
        groupId = "my-group-" + serverPort; // 서버 포트에 따라 groupId 설정
    }

    private final ChatMessageService chatMessageService;

    public KafkaConsumerConfig(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @Bean
    public ConsumerFactory<String, ChatMessage> consumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA_BROKER);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(configProps);
    }

    @Bean
    public ConcurrentMessageListenerContainer<String, ChatMessage> messageListenerContainer() {
        MessageListener<String, String> messageListener = new MessageListener<String, String>() {
            @Override
            public void onMessage(ConsumerRecord<String, String> record) {
                String message = record.value();
                System.out.println("1: Received Kafka message: " + message);
                chatMessageService.saveMessage(message);
            }
        };
        ContainerProperties containerProps = new ContainerProperties("chatting");
        containerProps.setMessageListener(messageListener);
        containerProps.setGroupId(groupId); // groupId 설정

        return new ConcurrentMessageListenerContainer<>(consumerFactory(), containerProps);
    }
}

