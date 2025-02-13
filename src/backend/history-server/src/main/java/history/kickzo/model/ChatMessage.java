package history.kickzo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class ChatMessage {

    @Id
    private String id;  // MongoDB 자동 생성 필드
    private Long roomId;  // 방 ID (Long으로 변경)
    private Long userId;  // 사용자 ID (Long으로 변경)
    private String message;  // 메시지 내용 (content -> message로 변경)
    private long timestamp;  // 메시지 전송 시간 (타임스탬프)

    // 생성자
    public ChatMessage(Long roomId, Long userId, String message, long timestamp) {
        this.roomId = roomId;
        this.userId = userId;
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getter와 Setter

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    // 타임스탬프 설정
    public void setTimestampToCurrentTime() {
        this.timestamp = System.currentTimeMillis();
    }
}
