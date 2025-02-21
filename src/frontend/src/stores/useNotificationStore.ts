import { create } from 'zustand';
import { NotificationDto, NotificationStatus } from '@/api/endpoints/friend/friend.interface';
import { persist } from 'zustand/middleware';
import { friendApi } from '@/api/endpoints/friend/friend.api';

interface NotificationStore {
  notifications: NotificationDto[];
  fetchNotifications: () => Promise<void>;
  acceptFriend: (notification: NotificationDto) => Promise<void>;
  rejectFriend: (notification: NotificationDto) => Promise<void>;
  updateNotificationStatus: (timestamp: number, status: NotificationStatus) => void;
}

export const useNotificationStore = create(
  persist<NotificationStore>(
    (set, get) => ({
      notifications: [],

      // 알림 조회
      fetchNotifications: async () => {
        const notifications = await friendApi.getNotifications();
        set({ notifications });
      },

      // 친구 수락
      acceptFriend: async (notification: NotificationDto) => {
        await friendApi.acceptFriend(notification.receiverId, notification.senderId);
        get().updateNotificationStatus(notification.timestamp, 'ACCEPTED');
      },

      // 친구 거절
      rejectFriend: async (notification: NotificationDto) => {
        await friendApi.rejectFriend(notification.receiverId, notification.senderId);
        get().updateNotificationStatus(notification.timestamp, 'REJECTED');
      },

      // 알림 업데이트 처리
      updateNotificationStatus: (timestamp: number, status: NotificationStatus) => {
        set(state => ({
          notifications: state.notifications.map(noti =>
            noti.timestamp === timestamp ? { ...noti, status } : noti,
          ),
        }));
      },
    }),
    {
      name: 'notification-storage',
    },
  ),
);
