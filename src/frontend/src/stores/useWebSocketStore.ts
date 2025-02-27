//- [x] 웹소켓 연결 후 서버에 유저 아이디 전송
//- [x] 내 채팅방 목록 조회 후 구독하기
//- [x] 초대 구독하기
//- [x] 친구 접속 알림
// v2 [ ] dm 받기
// v2 [ ] dm 보내기

import SockJS from 'sockjs-client';
import Stomp, { Client } from 'stompjs';
import { create } from 'zustand';
import { useUserStore } from './useUserStore';
import { FriendConnectionMessage } from '@/types/dto/Friend.dto';
import { useFriendStore } from './useFriendStore';
import { useNotificationStore } from './useNotificationStore';
import { useToastStore } from './useToastStore';
import { NotificationDto } from '@/api/endpoints/friend/friend.interface';
import { useMyRoomsStore } from './useMyRoomsStore';

interface WebSocketStore {
  socket: WebSocket | null;
  client: Client | null;
  subscriptions: Map<string, Stomp.Subscription>; // 구독 관리

  // 연결
  connect: () => void;
  disconnect: () => void;

  subTopic: <T>(destination: string, callback: (message: T) => void) => void;
  subscribeInvitations: <T>(userId: number, callback: (message: T) => void) => void;
  subscribeFriendConnection: <T>(userId: number, callback: (message: T) => void) => void;
  subscribeRoomUserInfo: (
    roomId: number,
    callback: (data: {
      userInfo: { userId: number; role: number; nickname: string; profileImageUrl: string };
    }) => void,
  ) => void;
  subscribeRoomRoleChange: (
    roomId: number,
    callback: (data: { targetUserId: number; newRole: number }) => void,
  ) => void;
  subscribeRoomPlaylistUpdate: (
    roomId: number,
    callback: (data: {
      playlist: { order: number; url: string; title: string; youtuber: string }[];
    }) => void,
  ) => void;
  unsubscribe: (destination: string) => void;
  unsubscribeAll: () => void;
  pubTopic: (destination: string, message: string) => void;
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
          get().subscribeInvitations<NotificationDto>(userId, message => {
            console.log('subscribeInvitations', message);
            useNotificationStore.getState().increaseNotificationCount();
            if (message.type === 'friend_request') {
              useToastStore.getState().addToast(
                `${message.senderNickname}님이 친구 요청을 보냈습니다.`,
                'info',
                5000,
                [
                  {
                    label: '수락',
                    onClick: () => {
                      useNotificationStore.getState().acceptFriend(message);
                      useToastStore.getState().removeToast(message.timestamp);
                      useNotificationStore.getState().decreaseNotificationCount();
                    },
                  },
                  {
                    label: '거절',
                    onClick: () => {
                      useNotificationStore.getState().rejectFriend(message);
                      useToastStore.getState().removeToast(message.timestamp);
                      useNotificationStore.getState().decreaseNotificationCount();
                    },
                  },
                ],
                message.timestamp,
              );
            } else {
              useToastStore
                .getState()
                .addToast(
                  `${message.senderNickname}님이 초대를 보냈습니다.`,
                  'info',
                  5000,
                  [],
                  message.timestamp,
                );
            }
          });
          get().subscribeFriendConnection<FriendConnectionMessage>(userId, message => {
            useFriendStore.getState().updateFriendStatus(message.userId, message.status);
          });
          useMyRoomsStore.getState().subscribeChat();
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
  subscribeFriendConnection: <T>(userId: number, callback: (message: T) => void = console.log) => {
    const destination = `/topic/user/${userId}/friend-state`;
    get().subTopic(destination, callback);
  },

  // 초대 구독
  subscribeInvitations: <T>(userId: number, callback: (message: T) => void = console.log) => {
    const destination = `/topic/user/${userId}/notification`;
    get().subTopic(destination, callback);
  },

  // 채팅방 내 신규 유저 정보 구독
  subscribeRoomUserInfo: (
    roomId: number,
    callback: (data: {
      userInfo: { userId: number; role: number; nickname: string; profileImageUrl: string };
    }) => void,
  ) => {
    const destination = `/topic/room/${roomId}/user-info`;
    get().subTopic(destination, callback);
  },

  // 채팅방 내 역할 변경 구독
  subscribeRoomRoleChange: (
    roomId: number,
    callback: (data: { targetUserId: number; newRole: number }) => void,
  ) => {
    const destination = `/topic/room/${roomId}/role-change`;
    get().subTopic(destination, callback);
  },

  // 채팅방 내 플레이리스트 업데이트 구독
  subscribeRoomPlaylistUpdate: (
    roomId: number,
    callback: (data: {
      playlist: { order: number; url: string; title: string; youtuber: string }[];
    }) => void,
  ) => {
    const destination = `/topic/room/${roomId}/playlist-update`;
    get().subTopic(destination, callback);
  },

  unsubscribe: (destination: string) => {
    const { client } = get();
    if (!client) return;

    const subscription = get().subscriptions.get(destination);
    subscription?.unsubscribe();
    get().subscriptions.delete(destination);
  },

  // 구독 해제
  unsubscribeAll: () => {
    get().subscriptions.forEach(sub => sub.unsubscribe());
    set({ subscriptions: new Map() });
  },

  pubTopic: (destination: string, message: string) => {
    const { client } = get();
    if (!client) {
      console.warn('⚠ WebSocket이 아직 연결되지 않았습니다.');
      return;
    }
    client.send(destination, {}, message);
  },
}));
