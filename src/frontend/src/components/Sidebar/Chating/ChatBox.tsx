import { useState, useRef, useEffect } from 'react';
import { ChatMessages } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatContainer, ChatScrollArea } from './index.css';
import { UserRole } from '@/types/enums/UserRole';
import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';

import styled from 'styled-components';

const initialChatData = Array.from({ length: 100 }, (_, i) => ({
  role: i % 2 === 0 ? UserRole.MEMBER : UserRole.CREATOR,
  nickname: `User${i}`,
  time: `10:${(i % 60).toString().padStart(2, '0')}`,
  text: `This is message number ${i}`,
}));

export const ChatBox = () => {
  const INITIAL_CHAT_NUM = 20;
  const EXTRA_CHAT_NUM = 5;
  const MAX_CHAT_NUM = 30;

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

  // if (chatContainerRef.current && visibleChat.length === INITIAL_CHAT_NUM) {
  //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  // }

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

      // 연결 해제 시 구독 취소
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
  const addMessage = (message: string, sender = 'Me') => {
    const newChat = {
      role: sender === 'Me' ? UserRole.MEMBER : UserRole.CREATOR,
      nickname: sender,
      time: new Date().toLocaleTimeString().slice(0, 5),
      text: message,
    };

    if (sender === 'Me') {
      sendMessage(message); // WebSocket을 통해 메시지 전송
    }

    // setChatData(prev => [...prev, newChat]);
    setChatData(prev => [...prev, newChat]);
    // scrollToBottom();

    if (extraDownNum) setVisibleChat(prev => [...prev, newChat]);
  };

  // 스크롤을 올릴 때 추가 메시지 로드
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

    // 스크롤이 최상단에 도달했을 때 (이전 메시지 불러오기)
    if (scrollTop === 0 && startIndex > 0) {
      const newStartIndex = Math.max(0, startIndex - EXTRA_CHAT_NUM);
      const prevHeight = scrollHeight;

      if (visibleChat.length === MAX_CHAT_NUM) setExtraDownNum(extraDownNum + EXTRA_CHAT_NUM);
      setStartIndex(newStartIndex);
      setVisibleChat(chatData.slice(newStartIndex, newStartIndex + MAX_CHAT_NUM));

      // 새 데이터가 추가된 후 스크롤 위치 보정 (이전 위치 유지)
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          const newHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = newHeight - prevHeight + 60 * EXTRA_CHAT_NUM;
        }
      });
    }

    // 스크롤이 최하단에 도달했을 때 (새로운 메시지 불러오기)
    else if (
      scrollTop + clientHeight >= scrollHeight - extraDownNum * 60 - 10 &&
      startIndex <= chatData.length - MAX_CHAT_NUM
    ) {
      console.log('🎯 ChatMessages 끝에 도달! 새로운 데이터 로드');

      const newStartIndex = Math.min(startIndex + EXTRA_CHAT_NUM, chatData.length - MAX_CHAT_NUM);
      const prevHeight = scrollHeight;

      if (visibleChat.length === MAX_CHAT_NUM) {
        setExtraDownNum(prev => Math.max(prev - EXTRA_CHAT_NUM, 0)); // 빈 공간 줄이기
        setExtraTopNum(extraTopNum - EXTRA_CHAT_NUM);
      }

      setStartIndex(newStartIndex);
      setVisibleChat(chatData.slice(newStartIndex, newStartIndex + MAX_CHAT_NUM));

      // 새 데이터가 추가된 후 스크롤 위치 보정 (이전 위치 유지)
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          const newHeight = chatContainerRef.current.scrollHeight;
          // chatContainerRef.current.scrollTop = newHeight - prevHeight + 60 * MAX_CHAT_NUM;
          chatContainerRef.current.scrollTop = newHeight - 100;
        }
      });
    }
  };

  // 스크롤 이벤트 등록 및 WebSocket 해제 처리
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      disconnect();
    };
  }, [startIndex]);

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
        <Blank $blankPadding={`${60 * extraTopNum}px`}>가상화된 빈공간</Blank>
        <ChatMessages chatData={visibleChat} />
        <Blank $blankPadding={`${60 * extraDownNum}px`}>가상화된 빈공간</Blank>
      </ChatScrollArea>
      <ChatInput onSendMessage={addMessage} />
      <button onClick={connect}>연결하기</button>
      <button onClick={disconnect}>연결 끊기</button>
      <p>Status: {status}</p>
      <button onClick={scrollToBottom}>맨 아래로</button>
    </ChatContainer>
  );
};

const Blank = styled.div<{ $blankPadding: string }>`
  padding-bottom: ${({ $blankPadding }) => $blankPadding};
`;
