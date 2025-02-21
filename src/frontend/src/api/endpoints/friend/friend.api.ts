import instance from '@/api/axios.instance';
import { FriendDto, NotificationDto } from './friend.interface';

export const friendApi = {
  // 친구 목록 제공
  getFriends: async () => {
    const { data } = await instance.get<{ friends: FriendDto[] }>('/friends/list');
    return data.friends;
  },

  // 친구 요청
  requestFriend: async (me: number, receiverId: number) => {
    const { data } = await instance.post(`/friends/request`, {
      senderId: me,
      receiverId,
    });
    return data;
  },

  // 친구 요청 수락
  acceptFriend: async (me: number, senderId: number) => {
    const { data } = await instance.post(`/friends/accept`, {
      senderId,
      receiverId: me,
    });
    return data;
  },

  // 친구 요청 거절
  rejectFriend: async (me: number, senderId: number) => {
    const { data } = await instance.post(`/friends/reject`, {
      senderId,
      receiverId: me,
    });
    return data;
  },

  // 알림 정보
  getNotifications: async () => {
    const { data } = await instance.get<{ requests: NotificationDto[] }>('/friends/requests');
    return data.requests;
  },

  // 안 읽은 알림 개수 제공
  getUnreadNotificationsCount: async () => {
    const { data } = await instance.get('/friends/unread');
    return data;
  },
};
