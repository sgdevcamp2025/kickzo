import { create } from 'zustand';
import { NotificationDto, NotificationStatus } from '@/api/endpoints/friend/friend.interface';
import { persist } from 'zustand/middleware';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { useFriendStore } from './useFriendStore';

interface NotificationStore {
  notifications: NotificationDto[];
  newNotificationCount: number;
  fetchNotifications: () => Promise<void>;
  acceptFriend: (notification: NotificationDto) => Promise<void>;
  rejectFriend: (notification: NotificationDto) => Promise<void>;
  updateNotificationStatus: (timestamp: number, status: NotificationStatus) => void;
  increaseNotificationCount: (n: number) => void;
  resetNotificationCount: () => void;
  clear: () => void;
}

export const useNotificationStore = create(
  persist<NotificationStore>(
    (set, get) => ({
      notifications: [],
      newNotificationCount: 0,
      // 알림 조회
      fetchNotifications: async () => {
        const notifications = await friendApi.getNotifications();
        set({ notifications });
      },

      // 친구 수락
      acceptFriend: async (notification: NotificationDto) => {
        try {
          await friendApi.acceptFriend(notification.receiverId, notification.senderId);
          get().updateNotificationStatus(notification.timestamp, 'ACCEPTED');
          useFriendStore.getState().fetchFriends();
        } catch (error) {
          console.error(error);
        }
      },

      // 친구 거절
      rejectFriend: async (notification: NotificationDto) => {
        try {
          await friendApi.rejectFriend(notification.receiverId, notification.senderId);
          get().updateNotificationStatus(notification.timestamp, 'REJECTED');
          useFriendStore.getState().fetchFriends();
        } catch (error) {
          console.error(error);
        }
      },

      // 알림 업데이트 처리
      updateNotificationStatus: (timestamp: number, status: NotificationStatus) => {
        set(state => ({
          notifications: state.notifications.map(noti =>
            noti.timestamp === timestamp ? { ...noti, status } : noti,
          ),
        }));
      },

      increaseNotificationCount: (n: number = 1) => {
        set(state => ({ newNotificationCount: state.newNotificationCount + n }));
      },

      resetNotificationCount: () => {
        set({ newNotificationCount: 0 });
      },

      clear: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'notification-storage',
    },
  ),
);
