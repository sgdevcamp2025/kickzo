import instance from '@/api/axios.instance';
import { PlaylistDto, RoomRequestDto, MyRoomDto, RoomDto, CurrentRoomDto } from './room.interface';

export const roomApi = {
  // 방 생성
  createRoom: async (roomInfo: RoomRequestDto) => {
    const { data } = await instance.post<{ code: string }>('/rooms/create-room', roomInfo);
    return data;
  },

  // 내 방 조회
  getMyRooms: async () => {
    const { data } = await instance.get<MyRoomDto[]>('/rooms/me');
    return data;
  },

  // 전체 방 조회
  getRooms: async (page: number) => {
    const response = await instance.get<RoomDto[]>('/rooms/all', {
      params: { page, size: 20 },
    });
    console.log(response.data);
    return response.data;
  },

  // 방 입장
  joinRoom: async (roomCode: string) => {
    const { data } = await instance.post<CurrentRoomDto>(`/rooms/join`, { roomCode });
    return data;
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

  // 방 참여자 조회
  getParticipants: async (roomId: string) => {
    const { data } = await instance.get(`/rooms/participants`, { params: { roomId } });
    return data;
  },

  // playlist 보내기(배열을 json 형식으로 보내기)
  sendPlaylist: async (roomId: number, playlist: PlaylistDto[]) => {
    const { data } = await instance.post('/rooms/playlist', {
      roomId,
      playlist: JSON.stringify(playlist),
    });
    return data;
  },

  // 역할 변경
  changeRole: async (roomId: number, userId: number, role: string) => {
    const body = {
      roomId,
      targetUserId: userId,
      newRole: role,
    };
    const { data } = await instance.post(`/rooms/change-role`, body);
    return data;
  },

  // 내 방 정보 수정
  updateMyRoomTitle: async (roomId: number, title: string) => {
    const { data } = await instance.patch(`/rooms/update`, { roomId, title });
    return data;
  },

  // 내 방 설명 수정
  updateMyRoomDescription: async (roomId: number, description: string) => {
    const { data } = await instance.patch(`/rooms/update`, { roomId, description });
    return data;
  },

  // 내 방 공개 여부 수정
  updateMyRoomPublic: async (roomId: number, isPublic: boolean) => {
    const { data } = await instance.patch(`/rooms/update`, { roomId, isPublic });
    return data;
  },
};
