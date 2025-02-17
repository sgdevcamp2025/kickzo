package kickzo.stomp_chat.dto.room;

public record ChatMessage(long roomId, long userId, String nickname, int role, String profileImageUrl, String content, String message) {}
