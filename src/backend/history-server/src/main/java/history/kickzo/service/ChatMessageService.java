package history.kickzo.service;

import org.springframework.stereotype.Service;
import history.kickzo.model.ChatMessage;
import history.kickzo.repository.ChatMessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ObjectMapper objectMapper;

    public ChatMessageService(ChatMessageRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public void saveMessage(String message) {
        try {
            // JSON 메시지를 ChatMessage 객체로 변환
            ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
            chatMessage.setTimestamp(System.currentTimeMillis());  // 현재 시간으로 타임스탬프 설정 (필요 시)

            // 저장할 데이터 출력
            System.out.println("Saving message to DB: ");
            System.out.println("ID: " + chatMessage.getId());
            System.out.println("User: " + chatMessage.getUserId());
            System.out.println("Message: " + chatMessage.getContent());
            System.out.println("Timestamp: " + chatMessage.getTimestamp());

            // DB에 저장
            repository.save(chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error parsing message: " + e.getMessage());
        }
    }

    public List<ChatMessage> getMessages(String roomId, long cursor, int limit) {
        List<ChatMessage> messages = repository.findByRoomIdOrderByTimestampDesc(roomId);
        System.out.println("Fetching messages before timestamp: " + cursor);
        // cursor 값에 따라 메시지 필터링
        return messages.stream()
                .filter(message -> message.getTimestamp() < cursor)  // cursor 이전 메시지들만
                .limit(limit)
                .toList();
    }
}