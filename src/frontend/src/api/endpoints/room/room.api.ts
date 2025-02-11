import instance from '@/api/axios.instance';
import { RoomRequestDto } from './room.interface';

export const roomApi = {
  // 방 생성
  createRoom: async (roomInfo: RoomRequestDto) => {
    const { data } = await instance.post<{ code: string }>('/rooms/create-room', roomInfo);
    return data;
  },

  // 내 방 조회
  getMyRooms: async () => {
    const { data } = await instance.get('/rooms/list/my');
    return data;
  },

  // 내 방 정보 수정
  updateMyRoom: async (roomId: number, roomInfo: RoomRequestDto) => {
    const body = {
      roomId,
      ...roomInfo,
    };
    const { data } = await instance.patch('/rooms/update', body);
    return data;
  },

  // 전체 방 조회
  getRooms: async (page: number = 0, size: number = 10) => {
    const queryParams = {
      page,
      size,
    };
    const { data } = await instance.get('/rooms/list/all', { params: queryParams });
    return data;
  },

  // 방 입장
  joinRoom: async (roomCode: string) => {
    const { data } = await instance.post(`/rooms/join/${roomCode}`);
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
  // getParticipants: async (roomId: string) => {
  //   const { data } = await instance.get(`/rooms/participants/${roomId}`);
  //   return data;
  // },

  // playlist 보내기(배열을 json 형식으로 보내기)
  postPlaylist: async (roomId: number, playlist: string[]) => {
    const { data } = await instance.post(`/rooms/playlists/${roomId}`, {
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
};
