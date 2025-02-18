import { useRef, useEffect, useCallback, useState } from 'react';
import { ChatInput } from '@/components/Sidebar/Chating/ChatInput';
import { ChatContainer, ChatScrollArea, ScrollButton } from './index.css';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { ChatLayout } from './ChatMessages/ChatLayout';
import ArrowDown from '@/assets/img/ArrowDown.svg';
export const Chat = () => {
  const messages = useCurrentRoomStore(state => state.messages);
  const sendMessage = useCurrentRoomStore(state => state.sendMessage);
  const fetchMessages = useCurrentRoomStore(state => state.fetchMessages);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const prevScrollHeightRef = useRef(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [newMessageCount, setnewMessageCount] = useState(0);

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
    } else if (isMyMessage || isAtBottom) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setIsMyMessage(false);
      setIsAtBottom(true);
    } else {
      // 새로운 메시지가 온 경우, 스크롤 버튼 띄우기
      setnewMessageCount(prev => prev + 1);
    }
  }, [messages]);

  const handleScrollToBottom = () => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

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

    const currentScrollTop = chatContainerRef.current.scrollTop;
    const scrollHeight = chatContainerRef.current.scrollHeight;
    const clientHeight = chatContainerRef.current.clientHeight;

    // 바텀에서 적당히 떨어진 거리 (예: 50px)
    const threshold = 120;

    prevScrollHeightRef.current = currentScrollTop;
    const isAtBottom = scrollHeight - clientHeight === currentScrollTop;

    if (isAtBottom) {
      setShowScrollButton(false);
      setIsAtBottom(true);
      setnewMessageCount(0);
    } else {
      if (scrollHeight - currentScrollTop - clientHeight > threshold) {
        setShowScrollButton(true);
      }
      setIsAtBottom(false);
    }
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
      {showScrollButton && (
        <ScrollButton onClick={handleScrollToBottom}>
          <img src={ArrowDown} alt="ArrowDown" />
          {newMessageCount != 0 && <span>{newMessageCount}</span>}
        </ScrollButton>
      )}
    </ChatContainer>
  );
};

// TODO: messages key={index} -> timestamp로 변경하기
