import { useState, useRef, useEffect, useCallback } from 'react';
import Stomp, { Client, Message } from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatInput } from '@/components/Sidebar/Chating/ChatInput';
import { ChatMessages } from '@/components/Sidebar/Chating/ChatMessages';
import { UserRole } from '@/types/enums/UserRole';
import { ChatContainer, ChatScrollArea, Blank } from './index.css';

const INITIAL_CHAT_NUM = 20;
const EXTRA_CHAT_NUM = 5;
const MAX_CHAT_NUM = 30;
const CHAT_HEIGHT = 60;

const initialChatData = Array.from({ length: 100 }, (_, i) => ({
  role: i % 2 === 0 ? UserRole.MEMBER : UserRole.CREATOR,
  nickname: `User${i}`,
  time: `10:${(i % 60).toString().padStart(2, '0')}`,
  text: `This is message number ${i}`,
}));

export const ChatBox = () => {
  const [chatData, setChatData] = useState(initialChatData);
  const [visibleChat, setVisibleChat] = useState(chatData.slice(-INITIAL_CHAT_NUM));
  const [startIndex, setStartIndex] = useState(chatData.length - INITIAL_CHAT_NUM);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [extraTopNum, setExtraTopNum] = useState(0);
  const [extraDownNum, setExtraDownNum] = useState(0);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [status, setStatus] = useState<string>('Disconnected');

  const userId = useRef(`user${Math.floor(Math.random() * 1000)}`);
  const roomId = '1';

  const isAtBottom = () => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, clientHeight, scrollHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 10;
  };

  // WebSocket 연결
  const connect = () => {
    if (stompClient) {
      console.warn('웹소켓이 이미 연결되어 있습니다.');
      return;
    }
    const API_BASE_URL = 'http://localhost:8000';
    const socket = new SockJS(`${API_BASE_URL}/api/chat/ws`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log('WebSocket Connected');
      setStatus('Connected');
      setStompClient(client);

      // 채팅방 구독
      const subscription = client.subscribe(`/topic/${roomId}`, (message: Message) => {
        try {
          const payload = JSON.parse(message.body);
          addMessage(payload.content, payload.userId);
        } catch (error) {
          console.error('❌: ', error);
        }
      });

      client.send(
        '/app/joinRoom',
        {},
        JSON.stringify({
          roomId: roomId,
          userId: userId.current,
        }),
      );

      return () => {
        subscription.unsubscribe();
      };
    });
  };

  // WebSocket 연결 해제
  const disconnect = () => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log('❌ 웹소켓 연결이 해제되었습니다.');
        setStatus('Disconnected');
        setStompClient(null);
      });
    } else {
      console.warn('웹소켓이 이미 연결되지 않았습니다.');
    }
  };

  // WebSocket을 통한 메시지 전송
  const sendMessage = (message: string) => {
    if (!stompClient || !stompClient.connected) {
      console.warn('웹소켓 연결이 되지 않아 메세지를 보낼 수 없습니다.');
      return;
    }
    stompClient.send('/app/sendMessage', {}, JSON.stringify({ roomId, message }));
  };

  // 새 메시지 추가
  const addMessage = (message: string, sender: string = 'Me') => {
    if (sender !== 'Me' && sender === userId.current) {
      return;
    }

    const newChat = {
      role: sender === 'Me' ? UserRole.MEMBER : UserRole.CREATOR,
      nickname: sender,
      time: new Date().toLocaleTimeString().slice(0, 5),
      text: message,
    };

    if (sender === 'Me') {
      sendMessage(message);
    }

    setChatData(prev => {
      const updated = [...prev, newChat];
      if (sender === 'Me' || isAtBottom()) {
        const newStartIndex = updated.length > MAX_CHAT_NUM ? updated.length - MAX_CHAT_NUM : 0;
        setStartIndex(newStartIndex);
        setVisibleChat(updated.slice(newStartIndex, updated.length));

        requestAnimationFrame(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        });
      }
      return updated;
    });
  };

  // 스크롤을 올릴 때 추가 메시지 로드
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

    if (scrollTop === 0 && startIndex > 0) {
      const newStartIndex = Math.max(0, startIndex - EXTRA_CHAT_NUM);
      const prevHeight = scrollHeight;
      if (visibleChat.length === MAX_CHAT_NUM) {
        setExtraDownNum(extraDownNum + EXTRA_CHAT_NUM);
      }
      setStartIndex(newStartIndex);
      setVisibleChat(chatData.slice(newStartIndex, newStartIndex + MAX_CHAT_NUM));
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          const newHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop =
            newHeight - prevHeight + CHAT_HEIGHT * EXTRA_CHAT_NUM;
        }
      });
    }
    // 스크롤이 최하단에 도달했을 때 (새로운 메시지 불러오기)
    else if (
      scrollTop + clientHeight >= scrollHeight - extraDownNum * CHAT_HEIGHT - 10 &&
      startIndex < chatData.length - MAX_CHAT_NUM
    ) {
      const newStartIndex = Math.min(startIndex + EXTRA_CHAT_NUM, chatData.length - MAX_CHAT_NUM);
      const prevHeight = scrollHeight;
      if (visibleChat.length === MAX_CHAT_NUM) {
        setExtraDownNum(prev => Math.max(prev - EXTRA_CHAT_NUM, 0));
        setExtraTopNum(extraTopNum + EXTRA_CHAT_NUM);
      }
      setStartIndex(newStartIndex);
      setVisibleChat(chatData.slice(newStartIndex, newStartIndex + MAX_CHAT_NUM));
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          const newHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop +=
            newHeight - prevHeight - CHAT_HEIGHT * EXTRA_CHAT_NUM;
        }
      });
    }
  }, [startIndex, visibleChat, chatData, extraDownNum, extraTopNum]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [stompClient]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <ChatContainer>
      <ChatScrollArea ref={chatContainerRef}>
        <Blank $blankPadding={`${CHAT_HEIGHT * extraTopNum}px`} />
        <ChatMessages chatData={visibleChat} />
        <Blank $blankPadding={`${CHAT_HEIGHT * extraDownNum}px`} />
      </ChatScrollArea>
      <ChatInput onSendMessage={addMessage} />
      <button onClick={connect}>연결하기</button>
      <button onClick={disconnect}>연결 끊기</button>
      <p>Status: {status}</p>
      <button onClick={scrollToBottom}>맨 아래로</button>
    </ChatContainer>
  );
};
