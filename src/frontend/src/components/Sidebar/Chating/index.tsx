import React, { useState, useRef, useEffect, useCallback } from 'react';
import Stomp, { Client, Message } from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatInput } from '@/components/Sidebar/Chating/ChatInput';
import { ChatMessages } from '@/components/Sidebar/Chating/ChatMessages';
import { UserRole } from '@/types/enums/UserRole';
import { ChatContainer, ChatScrollArea, Blank } from './index.css';
import { DoublyLinkedList } from '@/components/Sidebar/Chating/doublyLinkedList';

const MemoizedChatMessages = React.memo(ChatMessages);

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
  const chatListRef = useRef(new DoublyLinkedList(initialChatData));
  const [visibleChat, setVisibleChat] = useState(
    chatListRef.current.slice(
      Math.max(chatListRef.current.length - INITIAL_CHAT_NUM, 0),
      chatListRef.current.length,
    ),
  );
  const [startIndex, setStartIndex] = useState(
    Math.max(chatListRef.current.length - INITIAL_CHAT_NUM, 0),
  );
  const [extraTopNum, setExtraTopNum] = useState(0);
  const [extraDownNum, setExtraDownNum] = useState(0);
  const [status, setStatus] = useState<string>('Disconnected');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  const userId = useRef(`user${Math.floor(Math.random() * 1000)}`);
  const roomId = '1';

  const isAtBottom = useCallback(() => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, clientHeight, scrollHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 10;
  }, []);

  // WebSocket을 통한 메시지 전송
  const sendMessage = useCallback(
    (message: string) => {
      if (!stompClientRef.current || !stompClientRef.current.connected) {
        console.warn('웹소켓 연결이 되지 않아 메세지를 보낼 수 없습니다.');
        return;
      }
      stompClientRef.current.send('/app/sendMessage', {}, JSON.stringify({ roomId, message }));
    },
    [roomId],
  );

  // 새 메시지 추가
  const addMessage = useCallback(
    (message: string, sender: string = 'Me') => {
      if (sender !== 'Me' && sender === userId.current) return;

      const newChat = {
        role: sender === 'Me' ? UserRole.MEMBER : UserRole.CREATOR,
        nickname: sender,
        time: new Date().toLocaleTimeString().slice(0, 5),
        text: message,
      };

      if (sender === 'Me') {
        sendMessage(message);
      }

      chatListRef.current.push(newChat);
      const newLength = chatListRef.current.length;

      if (sender === 'Me' || isAtBottom()) {
        const newStartIndex = newLength > MAX_CHAT_NUM ? newLength - MAX_CHAT_NUM : 0;
        setStartIndex(newStartIndex);
        setVisibleChat(chatListRef.current.slice(newStartIndex, newLength));
        scrollToBottom();
      }
    },
    [isAtBottom, sendMessage],
  );

  // WebSocket 연결
  const connect = useCallback(() => {
    if (stompClientRef.current) {
      console.warn('웹소켓이 이미 연결되어 있습니다.');
      return;
    }
    const API_BASE_URL = 'http://localhost:8000';
    const socket = new SockJS(`${API_BASE_URL}/api/chat/ws`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log('WebSocket Connected');
      setStatus('Connected');
      stompClientRef.current = client;

      // 채팅방 구독
      const subscription = client.subscribe(`/topic/${roomId}`, (message: Message) => {
        try {
          const payload = JSON.parse(message.body);
          addMessage(payload.content, payload.userId);
        } catch (error) {
          console.error('❌: ', error);
        }
      });

      client.send('/app/joinRoom', {}, JSON.stringify({ roomId, userId: userId.current }));

      return () => {
        subscription.unsubscribe();
      };
    });
  }, [roomId, addMessage]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.disconnect(() => {
        console.log('❌ 웹소켓 연결이 해제되었습니다.');
        setStatus('Disconnected');
        stompClientRef.current = null;
      });
    } else {
      console.warn('웹소켓이 이미 연결되지 않았습니다.');
    }
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: chatContainerRef.current,
      threshold: 1.0,
    };
    const topObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && startIndex > 0) {
        const newStartIndex = Math.max(0, startIndex - EXTRA_CHAT_NUM);
        const prevHeight = chatContainerRef.current?.scrollHeight || 0;
        if (visibleChat.length === MAX_CHAT_NUM) {
          setExtraDownNum(prev => prev + EXTRA_CHAT_NUM);
        }
        setStartIndex(newStartIndex);
        setVisibleChat(chatListRef.current.slice(newStartIndex, newStartIndex + MAX_CHAT_NUM));
        requestAnimationFrame(() => {
          if (chatContainerRef.current) {
            const newHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = newHeight - prevHeight;
          }
        });
      }
    }, observerOptions);

    if (topSentinelRef.current) {
      topObserver.observe(topSentinelRef.current);
    }
    return () => {
      if (topSentinelRef.current) {
        topObserver.unobserve(topSentinelRef.current);
      }
    };
  }, [startIndex, visibleChat]);

  useEffect(() => {
    const observerOptions = {
      root: chatContainerRef.current,
      threshold: 1.0,
    };
    const bottomObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && startIndex < chatListRef.current.length - MAX_CHAT_NUM) {
        const newStartIndex = Math.min(
          startIndex + EXTRA_CHAT_NUM,
          chatListRef.current.length - MAX_CHAT_NUM,
        );
        const prevHeight = chatContainerRef.current?.scrollHeight || 0;
        if (visibleChat.length === MAX_CHAT_NUM) {
          setExtraDownNum(prev => Math.max(prev - EXTRA_CHAT_NUM, 0));
          setExtraTopNum(prev => prev + EXTRA_CHAT_NUM);
        }
        setStartIndex(newStartIndex);
        setVisibleChat(chatListRef.current.slice(newStartIndex, newStartIndex + MAX_CHAT_NUM));
        requestAnimationFrame(() => {
          if (chatContainerRef.current) {
            const newHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop +=
              newHeight - prevHeight - CHAT_HEIGHT * EXTRA_CHAT_NUM;
          }
        });
      }
    }, observerOptions);

    if (bottomSentinelRef.current) {
      bottomObserver.observe(bottomSentinelRef.current);
    }
    return () => {
      if (bottomSentinelRef.current) {
        bottomObserver.unobserve(bottomSentinelRef.current);
      }
    };
  }, [startIndex, visibleChat]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      setExtraTopNum(extraTopNum + extraDownNum);
      setExtraDownNum(0);
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
        <div ref={topSentinelRef} style={{ height: 1 }} />
        <MemoizedChatMessages chatData={visibleChat} />
        <div ref={bottomSentinelRef} style={{ height: 1 }} />
        <Blank $blankPadding={`${CHAT_HEIGHT * extraDownNum}px`} />
      </ChatScrollArea>
      <ChatInput onSendMessage={addMessage} />
      <button onClick={connect}>연결하기</button>
      <button onClick={disconnect}>연결 끊기</button>
      <p>Status: {status}</p>
    </ChatContainer>
  );
};
