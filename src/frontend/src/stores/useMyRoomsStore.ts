// - [x] 방 들어갔을 때 구독 처리

import { MyRoomDto } from '@/api/endpoints/room/room.interface';
import { create } from 'zustand';
import { roomApi } from '@/api/endpoints/room/room.api';
import { persist } from 'zustand/middleware';
import { useWebSocketStore } from './useWebSocketStore';
import { useCurrentRoomStore } from './useCurrentRoomStore';

interface MyRoomsStore {
  myRooms: MyRoomDto[];
  setMyRooms: (rooms: MyRoomDto[]) => void;
  fetchMyRooms: () => Promise<MyRoomDto[]>;
  clearMyRooms: () => void;
}

export const useMyRoomsStore = create(
  persist<MyRoomsStore>(
    set => ({
      myRooms: [],

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
          if (currentRoomId) { // 현재 /rooom에서 방을 보고 있다면 구독을 currentRoomStore에서 처리
            myRoomIds.splice(myRoomIds.indexOf(currentRoomId), 1);
          }
          useWebSocketStore.getState().subscribeRooms(myRoomIds);
          return myRooms;
        } catch (error) {
          console.error('Failed to fetch rooms:', error);
          return [];
        }
      },

      // 내 방 목록 초기화
      clearMyRooms: () => set({ myRooms: [] }),
    }),
    {
      name: 'my-rooms-storage',
    },
  ),
);
