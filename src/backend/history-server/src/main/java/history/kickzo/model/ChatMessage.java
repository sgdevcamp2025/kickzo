package history.kickzo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class ChatMessage {

    @Id
    private String id;  // MongoDB 자동 생성 필드
    private Long roomId;  // 방 ID
    private Long userId;  // 사용자 ID
    private String message;  // 메시지 내용
    private long timestamp;  // 메시지 전송 시간
    private String content;  // 이미지 URL 또는 파일 URL
    private int role;  // 유저 역할
    private String nickname;  // 유저 닉네임
    private String profileImageUrl;  // 프로필 이미지 URL 추가

    // 생성자
    public ChatMessage(Long roomId, Long userId, String message, long timestamp, String content, int role, String nickname, String profileImageUrl) {
        this.roomId = roomId;
        this.userId = userId;
        this.message = message;
        this.timestamp = timestamp;
        this.content = content;
        this.role = role;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    // 기본 생성자 (MongoDB에서 객체 변환 시 필요)
    public ChatMessage() {}

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    // 타임스탬프 설정
    public void setTimestampToCurrentTime() {
        this.timestamp = System.currentTimeMillis();
    }
}
