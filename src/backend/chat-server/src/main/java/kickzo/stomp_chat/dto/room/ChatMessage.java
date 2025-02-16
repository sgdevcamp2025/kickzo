package kickzo.stomp_chat.dto.room;

public record ChatMessage(long roomId, long userId, String content, String message) {}
