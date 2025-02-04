package history.kickzo.controller;

import history.kickzo.model.ChatMessage;
import history.kickzo.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping("/api/messages/{roomId}")
    public List<ChatMessage> getMessages(
            @PathVariable String roomId,
            @RequestParam(required = false) Long cursor,  // cursor는 이전 메시지의 타임스탬프
            @RequestParam(defaultValue = "10") int limit) {

        cursor = (cursor == null) ? System.currentTimeMillis() : cursor;  // 기본적으로 현재 시간
        return chatMessageService.getMessages(roomId, cursor, limit);
    }
}
