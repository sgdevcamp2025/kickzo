package kickzo.stomp_chat.config;

import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;

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

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Injected by Spring

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        // Kafka Consumer 설정
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


                // 메시지를 처리하는 로직을 여기에 추가
                String roomId = "1";

                if (roomId != null && !roomId.isEmpty()) {
                    // WebSocket으로 메시지 전송
                    messagingTemplate.convertAndSend("/topic/" + roomId, message);
                    System.out.println("Message sent to WebSocket topic: /topic/" + roomId);
                    System.out.println("Broadcasting message: " + message);
                } else {
                    System.err.println("Failed to send message: roomId is null or empty.");
                }
            }
        };

        ContainerProperties containerProps = new ContainerProperties("chatting");
        containerProps.setMessageListener(messageListener);
        containerProps.setGroupId(groupId); // groupId 설정

        return new ConcurrentMessageListenerContainer<>(consumerFactory(), containerProps);
    }
}
