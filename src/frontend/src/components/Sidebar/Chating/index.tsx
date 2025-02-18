import { useRef, useEffect, useCallback, useState } from 'react';
import { ChatInput } from '@/components/Sidebar/Chating/ChatInput';
import { ChatContainer, ChatScrollArea } from './index.css';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { ChatLayout } from './ChatMessages/ChatLayout';

export const Chat = () => {
  const messages = useCurrentRoomStore(state => state.messages);
  const sendMessage = useCurrentRoomStore(state => state.sendMessage);
  const fetchMessages = useCurrentRoomStore(state => state.fetchMessages);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const prevScrollHeightRef = useRef(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isMyMessage, setIsMyMessage] = useState(false);

  // 최초 메시지 로딩 시 스크롤 이동
  useEffect(() => {
    if (!chatContainerRef.current || !messages.length) return;

    if (isInitialLoad) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  // 메시지 변경 시 스크롤 이동
  useEffect(() => {
    if (!chatContainerRef.current) return;

    if (prevScrollHeightRef.current && isFetching) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight - prevScrollHeightRef.current;
      setIsFetching(false);
    } else if (isMyMessage) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setIsMyMessage(false);
    }
  }, [messages]);

  // 메시지 추가
  const addMessage = useCallback(
    (message: string) => {
      prevScrollHeightRef.current = 0;
      setIsMyMessage(true);
      sendMessage(message);
    },
    [sendMessage],
  );

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    prevScrollHeightRef.current = chatContainerRef.current.scrollTop;
    if (chatContainerRef.current.scrollTop === 0) {
      prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
      console.log('fetchMessages');
      setIsFetching(true);
      fetchMessages(useCurrentRoomStore.getState().messages[0]?.timestamp);
    }
  };

  return (
    <ChatContainer>
      <ChatScrollArea ref={chatContainerRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <ChatLayout message={message} key={index} />
        ))}
      </ChatScrollArea>
      <ChatInput onSendMessage={msg => addMessage(msg)} />
    </ChatContainer>
  );
};

// TODO: messages key={index} -> timestamp로 변경하기
