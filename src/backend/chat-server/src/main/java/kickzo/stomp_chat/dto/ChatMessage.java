package kickzo.stomp_chat.dto;

public record ChatMessage(long roomId, long userId, String content, String message) {}
