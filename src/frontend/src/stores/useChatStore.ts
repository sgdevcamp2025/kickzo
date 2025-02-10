import { create } from 'zustand';
import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';
import { UserRole } from '@/types/enums/UserRole';

interface IChatState {
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

export const useChatStore = create<IChatState>((set, get) => ({
  chatData: [],
  stompClient: null,
  status: 'Disconnected',
  userId: `users(Math.floor(Math.random()*1000))`,
  roomId: '1',

  // WebSocket 연결
  connect: () => {
    if (get().stompClient) {
      console.warn('웹소켓이 이미 연결되어 있스빈다.');
      return;
    }

    const API_BASE_URL = 'http://localhost:8000';
    const socket = new SockJS(`${API_BASE_URL}/api/chat/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log('WebSocket Connected');
      set({ status: 'Connected', stompClient: client });

      const subscription = client.subscribe(`/topic/${get().roomId}`, (message: Message) => {
        try {
          const payload = JSON.parse(message.body);
          get().addMessage(payload.content, payload.userId);
        } catch (error) {
          console.error('❌: ', error);
        }
      });

      client.send(
        '/app/joinRoom',
        {},
        JSON.stringify({
          roomId: get().roomId,
          userId: get().userId,
        }),
      );
      return () => {
        subscription.unsubscribe();
      };
    });
  },

  // WebSocket 연결 해제
  disconnect: () => {
    const stompClient = get().stompClient;
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log('❌ 웹소켓 연결이 해제되었습니다.');
        set({ status: 'Disconnected', stompClient: null });
      });
    } else {
      console.warn('웹소켓이 이미 연결되지 않았습니다.');
    }
  },
  // WebSocket을 통한 메시지 전송
  sendMessage: (message: string) => {
    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      console.warn('웹소켓 연결이 되지 않아 메세지를 보낼 수 없습니다.');
      return;
    }
    stompClient.send('/app/sendMessage', {}, JSON.stringify({ roomId: get().roomId, message }));
  },
  // 새 메시지 추가
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

    // setChatData(prev => [...prev, newChat]);
    set(state => ({ chatData: [...state.chatData, newChat] }));
    // scrollToBottom();
  },
}));
