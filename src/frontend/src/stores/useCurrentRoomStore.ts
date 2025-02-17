// TODO: 새로운 사람 등장: user-info
// TODO: 방 정보 변경: room-update
// TODO: 영상 시간 변경: playlistTime
// TODO: 플레이리스트 변경: playlist-update
// TODO: 역할 변경: role-chage

import { create } from 'zustand';
import { CurrentRoomDto } from '@/api/endpoints/room/room.interface';
import { useWebSocketStore } from './useWebSocketStore';
import { useUserStore } from './useUserStore';
import { ReceiveMessageDto, SendMessageDto } from '@/types/dto/Message.dto';

interface CurrentRoomStore {
  currentRoom: CurrentRoomDto | null;
  messages: ReceiveMessageDto[];
  sendMessage: (messageDto: SendMessageDto) => void;
  subscribeChat: (roomId: number) => void;
  addMessage: (message: ReceiveMessageDto) => void;
  setCurrentRoom: (room: CurrentRoomDto) => void;
  clearCurrentRoom: () => void;
}

export const useCurrentRoomStore = create<CurrentRoomStore>((set, get) => ({
  currentRoom: null,
  messages: [],

  setCurrentRoom: (room: CurrentRoomDto) => set({ currentRoom: room }),
  clearCurrentRoom: () => set({ currentRoom: null }),

  subscribeChat: (roomId: number) => {
    const destination = `/topic/room/${roomId}/chat`;
    useWebSocketStore.getState().subTopic(destination, (message: ReceiveMessageDto) => {
      get().addMessage(message);
    });
  },

  sendMessage: (messageDto: SendMessageDto) => {
    const { client } = useWebSocketStore.getState();
    if (!client) return;

    const { user } = useUserStore.getState();
    if (!user) return;

    client.send(`/app/send-message`, {}, JSON.stringify(messageDto));
  },

  addMessage: (message: ReceiveMessageDto) =>
    set(state => ({ messages: [...state.messages, message] })),
}));
