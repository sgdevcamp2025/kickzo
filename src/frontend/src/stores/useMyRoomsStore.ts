// - [x] 방 들어갔을 때 구독 처리

import {
  CurrentRoomDto,
  MyRoomDto,
  ReceiveMessageDto,
  SendMessageDto,
} from '@/api/endpoints/room/room.interface';
import { create } from 'zustand';
import { roomApi } from '@/api/endpoints/room/room.api';
import { persist } from 'zustand/middleware';
import { useWebSocketStore } from './useWebSocketStore';
import { useUserStore } from './useUserStore';
import { UserRole } from '@/types/enums/UserRole';

interface MyRoomsStore {
  roomId?: number; // 현재 보는 방의 id
  currentRoom: CurrentRoomDto | null; // 현재 보는 방의 정보
  messages: ReceiveMessageDto[]; // 현재 방의 메시지 목록
  messageQueue: ReceiveMessageDto[]; // 현재 방의 메시지 큐
  myRooms: MyRoomDto[]; // 내 방 목록
  newChatCount: number; // 새로운 채팅 수
  setMyRooms: (rooms: MyRoomDto[]) => void; // 내 방 목록 설정
  fetchMyRooms: () => Promise<MyRoomDto[]>; // 내 방 목록 조회
  subscribeRoom: (roomId: number) => void; // 방 채팅 구독
  subscribeRooms: (roomIds: number[]) => void;
  resetNewChatCount: () => void;
  clearMyRooms: () => void;
  sendMessage: (message: string) => void;
  subscribeChat: () => void;
  fetchMessages: (cursor?: number, limit?: number) => Promise<number | undefined>;
  addMessage: (message: ReceiveMessageDto) => void;
  setCurrentRoom: (room: CurrentRoomDto) => void;
  clearCurrentRoom: () => void;
  processBatchMessages: () => void;
  pubTopic: (destination: string, message: string) => void;
}

const BATCH_SIZE = 20;
const BATCH_INTERVAL = 100;

export const useMyRoomsStore = create(
  persist<MyRoomsStore>(
    (set, get) => ({
      roomId: undefined,
      currentRoom: null,
      messages: [],
      messageQueue: [],
      myRooms: [],
      newChatCount: 0,
      newChatRooms: {},
      // 내 방 목록 설정
      setMyRooms: (rooms: MyRoomDto[]) => set({ myRooms: rooms }),

      // 내 방 목록 조회
      fetchMyRooms: async () => {
        try {
          const myRooms = await roomApi.getMyRooms();
          set({ myRooms });
          console.log('myRooms', myRooms);
          const myRoomIds = myRooms.map(room => room.roomId);
          get().subscribeRooms(myRoomIds);
          return myRooms;
        } catch (error) {
          console.error('Failed to fetch rooms:', error);
          return [];
        }
      },

      // 방 채팅 구독
      subscribeRoom: (roomId: number) => {
        const destination = `/topic/room/${roomId}/chat`;
        useWebSocketStore.getState().subTopic(destination, message => {
          console.log('subscribeRoomChat', message);
          set(state => ({
            newChatCount: state.newChatCount + 1,
          }));
        });
      },

      // 내가 속한 방 채팅 구독
      subscribeRooms: (roomIds: number[]) => {
        if (!roomIds) return;
        roomIds.forEach(roomId => {
          get().subscribeRoom(roomId);
        });
      },

      resetNewChatCount: () => {
        set({ newChatCount: 0 });
      },

      // 내 방 목록 초기화
      clearMyRooms: () => set({ myRooms: [], newChatCount: 0 }),

      // 현재 방 설정
      setCurrentRoom: (room: CurrentRoomDto) => {
        set({ currentRoom: room, roomId: room.roomDetails.roomInfo[0]?.roomId });
        get().fetchMessages();
        get().subscribeChat();
      },

      // 현재 방 초기화
      clearCurrentRoom: () =>
        set({ roomId: undefined, currentRoom: null, messages: [], messageQueue: [] }),

      // 현재 방 채팅 구독
      subscribeChat: () => {
        const roomId = get().roomId;
        console.log('---------subscribeChat', roomId);
        if (!roomId) return;

        const destination = `/topic/room/${roomId}/chat`;
        useWebSocketStore.getState().subTopic(destination, (message: ReceiveMessageDto) => {
          set(state => ({ messageQueue: [...state.messageQueue, message] }));
        });

        const intervalId = setInterval(() => {
          get().processBatchMessages();
        }, BATCH_INTERVAL);

        return () => clearInterval(intervalId);
      },

      processBatchMessages: () => {
        set(state => {
          if (state.messageQueue.length === 0) return state;

          // 큐에서 일정 개수만큼 메시지를 가져옴
          const batch = state.messageQueue.slice(0, BATCH_SIZE);
          const remainingQueue = state.messageQueue.slice(BATCH_SIZE);

          // 메시지 배열과 큐 업데이트
          return {
            ...state,
            messages: [...state.messages, ...batch],
            messageQueue: remainingQueue,
          };
        });
      },

      // 현재 방 메시지 조회
      fetchMessages: async (cursor?: number, limit?: number) => {
        const roomId = get().roomId;
        if (!roomId) return;
        const messageHistory = await roomApi.getMessages(roomId, cursor, limit ?? 30);
        const sortedMessages = messageHistory.sort((a, b) => a.timestamp - b.timestamp);
        set({ messages: [...sortedMessages, ...get().messages] });

        return messageHistory.length;
      },

      // 현재 방 메시지 전송
      sendMessage: (message: string) => {
        const { client } = useWebSocketStore.getState();
        if (!client) return;

        const user = useUserStore.getState().user;
        if (!user) return;
        const roomId = get().roomId;
        const myRole = get().currentRoom?.myRole;
        if (!roomId) return;

        const messageDto: SendMessageDto = {
          roomId: roomId,
          userId: user.userId,
          nickname: user.nickname,
          role: myRole ?? UserRole.MEMBER,
          profileImageUrl: user.profileImageUrl,
          content: null,
          message: message,
        };
        console.log('---------messageDto', messageDto);
        client.send(`/app/send-message`, {}, JSON.stringify(messageDto));
      },

      // 현재 방 메시지 추가
      addMessage: (message: ReceiveMessageDto) =>
        set(state => ({ messages: [...state.messages, message] })),

      // 웹소켓 토픽 발행
      pubTopic: (destination: string, message: string) => {
        const { client } = useWebSocketStore.getState();
        if (client) {
          client.send(destination, {}, message);
        } else {
          console.warn('WebSocket이 아직 연결되지 않았습니다.');
        }
      },
    }),
    {
      name: 'my-rooms-storage',
    },
  ),
);
