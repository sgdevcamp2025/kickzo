// - [x] 방 들어갔을 때 구독 처리

import { MyRoomDto } from '@/api/endpoints/room/room.interface';
import { create } from 'zustand';
import { roomApi } from '@/api/endpoints/room/room.api';
import { persist } from 'zustand/middleware';
import { useWebSocketStore } from './useWebSocketStore';
import { useCurrentRoomStore } from './useCurrentRoomStore';

interface MyRoomsStore {
  myRooms: MyRoomDto[];
  newChatCount: number;
  setMyRooms: (rooms: MyRoomDto[]) => void;
  fetchMyRooms: () => Promise<MyRoomDto[]>;
  subscribeRoom: (roomId: number) => void;
  subscribeRooms: (roomIds: number[]) => void;
  resetNewChatCount: () => void;
  clearMyRooms: () => void;
}

export const useMyRoomsStore = create(
  persist<MyRoomsStore>(
    (set, get) => ({
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
          const currentRoomId = useCurrentRoomStore.getState().roomId;
          if (currentRoomId) {
            // 현재 /rooom에서 방을 보고 있다면 구독을 currentRoomStore에서 처리
            myRoomIds.splice(myRoomIds.indexOf(currentRoomId), 1);
          }
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
    }),
    {
      name: 'my-rooms-storage',
    },
  ),
);
