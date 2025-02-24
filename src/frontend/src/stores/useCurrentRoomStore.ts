// TODO: 새로운 사람 등장: user-info
// TODO: 방 정보 변경: room-update
// TODO: 영상 시간 변경: playlistTime
// TODO: 플레이리스트 변경: playlist-update
// TODO: 역할 변경: role-chage

import { create } from 'zustand';
import { CurrentRoomDto } from '@/api/endpoints/room/room.interface';
import { useWebSocketStore } from './useWebSocketStore';
import { useUserStore } from './useUserStore';
import { ReceiveMessageDto, SendMessageDto } from '@/api/endpoints/room/room.interface';
import { roomApi } from '@/api/endpoints/room/room.api';
import { UserRole } from '@/types/enums/UserRole';

interface CurrentRoomStore {
  roomId?: number;
  currentRoom: CurrentRoomDto | null;
  messages: ReceiveMessageDto[];
  messageQueue: ReceiveMessageDto[];
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

export const useCurrentRoomStore = create<CurrentRoomStore>((set, get) => ({
  roomId: undefined,
  currentRoom: null,
  messages: [],
  messageQueue: [],
  setCurrentRoom: (room: CurrentRoomDto) => {
    set({ currentRoom: room, roomId: room.roomDetails.roomInfo[0]?.roomId });
    get().fetchMessages();
    get().subscribeChat();
  },
  clearCurrentRoom: () =>
    set({ roomId: undefined, currentRoom: null, messages: [], messageQueue: [] }),

  subscribeChat: () => {
    const roomId = get().roomId;
    if (!roomId) return;

    const destination = `/topic/room/${roomId}/chat`;
    useWebSocketStore.getState().subTopic(destination, (message: ReceiveMessageDto) => {
      console.log('---------message', message);
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

  fetchMessages: async (cursor?: number, limit?: number) => {
    const roomId = get().roomId;
    if (!roomId) return;
    const messageHistory = await roomApi.getMessages(roomId, cursor, limit ?? 30);
    const sortedMessages = messageHistory.sort((a, b) => a.timestamp - b.timestamp);
    set({ messages: [...sortedMessages, ...get().messages] });

    return messageHistory.length;
  },

  sendMessage: (message: string) => {
    const { client } = useWebSocketStore.getState();
    if (!client) return;

    const { user } = useUserStore.getState();
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

  addMessage: (message: ReceiveMessageDto) =>
    set(state => ({ messages: [...state.messages, message] })),

  pubTopic: (destination: string, message: string) => {
    const { client } = useWebSocketStore.getState();
    if (client) {
      client.send(destination, {}, message);
    } else {
      console.warn('WebSocket이 아직 연결되지 않았습니다.');
    }
  },
}));
