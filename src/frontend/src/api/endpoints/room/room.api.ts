import instance from '@/api/axios.instance';
import {
  PlaylistDto,
  RoomRequestDto,
  MyRoomDto,
  RoomDto,
  CurrentRoomDto,
  ReceiveMessageDto,
  ElasticSearchDto,
} from './room.interface';
import { logAxiosError } from '@/api/axios.log';
import { ErrorType } from '@/types/enums/ErrorType';

export const roomApi = {
  // 방 생성
  createRoom: async (roomInfo: RoomRequestDto) => {
    try {
      const { data } = await instance.post<{ code: string }>('/rooms/create-room', roomInfo);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '방 생성 실패');
      throw error;
    }
  },

  // 내 방 조회
  getMyRooms: async () => {
    try {
      const { data } = await instance.get<MyRoomDto[]>('/rooms/me');
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '내 방 조회 실패');
      throw error;
    }
  },

  // 전체 방 조회
  getRooms: async (page: number) => {
    try {
      const response = await instance.get<RoomDto[]>('/rooms/all', {
        params: { page, size: 20 },
      });
      return response.data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '전체 방 조회 실패');
      throw error;
    }
  },

  // 방 입장
  joinRoom: async (roomCode: string) => {
    try {
      const { data } = await instance.post<CurrentRoomDto>(`/rooms/join`, { roomCode });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '방 입장 실패');
      throw error;
    }
  },

  // 방 나가기
  // leaveRoom: async (roomId: string) => {
  //   const { data } = await instance.post(`/rooms/leave/${roomId}`);
  //   return data;
  // },

  // 방 삭제
  // deleteRoom: async (roomId: string) => {
  //   const { data } = await instance.delete(`/rooms/delete/${roomId}`);
  //   return data;
  // },

  // 메시지 조회
  getMessages: async (roomId: number, cursor?: number, limit?: number) => {
    try {
      const { data } = await instance.get<ReceiveMessageDto[]>(`/messages/${roomId}`, {
        params: { cursor, limit: limit ?? 10 },
      });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '메시지 조회 실패');
      throw error;
    }
  },

  // 방 참여자 조회
  getParticipants: async (roomId: string) => {
    try {
      const { data } = await instance.get(`/rooms/participants`, { params: { roomId } });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '방 참여자 조회 실패');
      throw error;
    }
  },

  // playlist 보내기(배열을 json 형식으로 보내기)
  sendPlaylist: async (roomId: number, playlist: PlaylistDto[]) => {
    try {
      const { data } = await instance.post('/rooms/playlist', {
        roomId,
        playlist,
      });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, 'playlist 보내기 실패');
      throw error;
    }
  },

  // 역할 변경
  changeRole: async (roomId: number, userId: number, role: string) => {
    const body = {
      roomId,
      targetUserId: userId,
      newRole: role,
    };

    try {
      const { data } = await instance.patch(`/rooms/change-role`, body);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '역할 변경 실패');
      throw error;
    }
  },

  // 내 방 정보 수정
  updateMyRoomTitle: async (roomId: number, title: string) => {
    try {
      const { data } = await instance.patch(`/rooms/update`, { roomId, title });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '내 방 제목 수정 실패');
      throw error;
    }
  },

  // 내 방 설명 수정
  updateMyRoomDescription: async (roomId: number, description: string) => {
    try {
      const { data } = await instance.patch(`/rooms/update`, { roomId, description });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '내 방 설명 수정 실패');
      throw error;
    }
  },

  // 내 방 공개 여부 수정
  updateMyRoomPublic: async (roomId: number, isPublic: boolean) => {
    try {
      const { data } = await instance.patch(`/rooms/update`, { roomId, isPublic });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '내 방 공개 여부 수정 실패');
      throw error;
    }
  },

  searchFromElastic: async (keyword: string) => {
    try {
      const { data } = await instance.get<ElasticSearchDto>(`/search`, { params: { keyword } });
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.ROOM, '엘라스틱서치 검색 실패');
      throw error;
    }
  },
};
