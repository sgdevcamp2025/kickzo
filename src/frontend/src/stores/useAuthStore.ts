import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFriendStore } from './useFriendStore';
import { useNotificationStore } from './useNotificationStore';
import { useUserStore } from './useUserStore';
import { useMyRoomsStore } from './useMyRoomsStore';
import { useWebSocketStore } from './useWebSocketStore';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshAccessToken: () => Promise<string | null>;
  clear: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    set => ({
      accessToken: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      refreshAccessToken: async () => {
        try {
          const { data } = await instance.post('/auth/token/refresh');
          set({ accessToken: data.accessToken });
          return data.accessToken;
        } catch {
          set({ accessToken: null });
          return null;
        }
      },
      clear: () => {
        set({ accessToken: null });
        useFriendStore.getState().clear();
        useNotificationStore.getState().clear();
        useMyRoomsStore.getState().clearMyRooms();
        useUserStore.getState().clearProfile();
        useWebSocketStore.getState().disconnect();
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
