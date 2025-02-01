package history.kickzo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class ChatMessage {

    @Id
    private String id;  // MongoDB 자동 생성 필드
    private String roomId;  // 방 ID
    private String userId;  // 사용자 ID
    private String content;  // 메시지 내용
    private long timestamp;  // 메시지 전송 시간 (타임스탬프)
    private String type;  // 메시지 타입 (optional, 예: "message" 등)

    // 생성자
    public ChatMessage(String roomId, String userId, String content, long timestamp, String type) {
        this.roomId = roomId;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
    }

    // Getter와 Setter

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    // 타임스탬프 설정
    public void setTimestampToCurrentTime() {
        this.timestamp = System.currentTimeMillis();
    }
}
