package history.kickzo.repository;

import history.kickzo.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    // 특정 방의 메시지들을 타임스탬프 기준으로 정렬하여 가져오는 메서드
    List<ChatMessage> findByRoomIdOrderByTimestampDesc(String roomId);
}
