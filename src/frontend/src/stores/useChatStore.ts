import { create } from 'zustand';
import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';
import { UserRole } from '@/types/enums/UserRole';

const API_BASE_URL = 'http://localhost:8000';

const initialChatData = Array.from({ length: 100 }, (_, i) => ({
  role: i % 2 === 0 ? UserRole.MEMBER : UserRole.CREATOR,
  nickname: `User${i}`,
  time: `10:${(i % 60).toString().padStart(2, '0')}`,
  text: `This is message number ${i}`,
}));

interface ChatState {
  chatData: { role: UserRole; nickname: string; time: string; text: string }[];
  stompClient: Client | null;
  status: string;
  userId: string;
  roomId: string;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  addMessage: (message: string, sender?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatData: initialChatData,
  stompClient: null,
  status: 'Disconnected',
  userId: `user${Math.floor(Math.random() * 1000)}`,
  roomId: '1',

  // WebSocket 연결
  connect: () => {
    if (get().stompClient) {
      console.warn('웹소켓이 이미 연결되어 있습니다.');
      return;
    }
    const socket = new SockJS(`${API_BASE_URL}/api/chat/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log('✅ WebSocket Connected');
      set({ status: 'Connected', stompClient: client });

      const subscription = client.subscribe(`/topic/${get().roomId}`, (message: Message) => {
        try {
          const payload = JSON.parse(message.body);
          get().addMessage(payload.content, payload.userId);
        } catch (error) {
          console.error('❌ 메시지 처리 오류:', error);
        }
      });

      client.send(
        '/app/joinRoom',
        {},
        JSON.stringify({ roomId: get().roomId, userId: get().userId }),
      );

      return () => {
        subscription.unsubscribe();
      };
    });
  },

  // WebSocket 연결 해제
  disconnect: () => {
    const client = get().stompClient;
    if (client && client.connected) {
      client.disconnect(() => {
        console.log('❌ WebSocket Disconnected');
        set({ status: 'Disconnected', stompClient: null });
      });
    } else {
      console.warn('웹소켓이 이미 연결되지 않았습니다.');
    }
  },

  // 메시지 전송
  sendMessage: (message: string) => {
    const client = get().stompClient;
    if (!client || !client.connected) {
      console.warn('웹소켓이 연결되지 않아 메시지를 보낼 수 없습니다.');
      return;
    }
    client.send('/app/sendMessage', {}, JSON.stringify({ roomId: get().roomId, message }));
  },

  // 새 메시지 추가 (수신 시 또는 사용자가 보낼 때)
  addMessage: (message: string, sender = 'Me') => {
    const newChat = {
      role: sender === 'Me' ? UserRole.MEMBER : UserRole.CREATOR,
      nickname: sender,
      time: new Date().toLocaleTimeString().slice(0, 5),
      text: message,
    };
    if (sender === 'Me') {
      get().sendMessage(message);
    }
    set(state => ({ chatData: [...state.chatData, newChat] }));
  },
}));
