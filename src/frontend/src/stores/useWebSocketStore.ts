//- [x] 웹소켓 연결 후 서버에 유저 아이디 전송
//- [x] 내 채팅방 목록 조회 후 구독하기
//- [x] 초대 구독하기
//- [x] 친구 접속 알림
// v2 [ ] dm 받기
// v2 [ ] dm 보내기

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Client } from 'stompjs';
import { create } from 'zustand';
import { useUserStore } from './useUserStore';

interface WebSocketStore {
  socket: WebSocket | null;
  client: Client | null;
  subscriptions: Map<string, Stomp.Subscription>; // 구독 관리

  // 연결
  connect: () => void;
  disconnect: () => void;

  subTopic: <T>(destination: string, callback: (message: T) => void) => void;
  subscribeRoom: (roomId: number) => void;
  subscribeRooms: (roomIds: number[]) => void;
  subscribeInvitations: (userId: number) => void;
  subscribeFriendConnection: (userId: number) => void;
  unsubscribeAll: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  client: null,
  subscriptions: new Map(),

  // 연결
  connect: () => {
    if (get().client?.connected) {
      get().disconnect();
    }
    
    // 기존 소켓 정리
    if (get().socket) {
      get().socket?.close();
    }

    const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        console.log('✅ WebSocket Connected');
        set({ client, socket });

        const userId = useUserStore.getState().user?.userId;
        if (userId) {
          client.send('/app/connect', {}, JSON.stringify({ userId }));
          get().subscribeInvitations(userId);
          get().subscribeFriendConnection(userId);
        }
      },
      error => {
        console.error('❌ WebSocket Connection Error:', error);
        set({ client: null });
      },
    );
  },

  // 연결 해제
  disconnect: () => {
    const store = get();
    if (!store.client) return;

    store.unsubscribeAll();

    store.client.disconnect(() => {
      set({ client: null });
    });
  },

  // 토픽 구독
  subTopic: <T>(destination: string, callback: (message: T) => void) => {
    const { client } = get();
    if (!client) return;

    if (get().subscriptions.has(destination)) {
      const existingSub = get().subscriptions.get(destination);
      existingSub?.unsubscribe();
      get().subscriptions.delete(destination);
    }

    const subscription = client.subscribe(destination, message => {
      const receivedMessage = JSON.parse(message.body);

      callback(receivedMessage);
    });

    get().subscriptions.set(destination, subscription);
  },

  // 친구 접속 알림 구독
  subscribeFriendConnection: (userId: number) => {
    const destination = `/topic/user/${userId}/friend-state`;
    get().subTopic(destination, message => {
      console.log('subscribeFriendConnection', message);
    });
  },

  // 초대 구독
  subscribeInvitations: (userId: number) => {
    const destination = `/topic/user/${userId}/notification`;
    get().subTopic(destination, message => {
      console.log('subscribeInvitations', message);
    });
  },

  // 방 채팅 구독
  subscribeRoom: (roomId: number) => {
    const destination = `/topic/room/${roomId}/chat`;
    get().subTopic(destination, message => {
      console.log('subscribeRoom', message);
    });
  },

  // 내가 속한 방 채팅 구독
  subscribeRooms: (roomIds: number[]) => {
    if (!roomIds) return;

    roomIds.forEach(roomId => {
      get().subscribeRoom(roomId);
    });
  },

  // 구독 해제
  unsubscribeAll: () => {
    get().subscriptions.forEach(sub => sub.unsubscribe());
    set({ subscriptions: new Map() });
  },
}));
