import axios from 'axios';
import { create } from 'zustand';

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

export const useAuthStore = create<AuthStore>(set => ({
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
  },
}));
