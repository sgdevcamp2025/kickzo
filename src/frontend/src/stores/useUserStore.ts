import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '@/api/endpoints/user/user.api';
import { UserResponseDto } from '@/api/endpoints/user/user.interface';

interface UserStore {
  user: UserResponseDto | null;
  setUser: (user: UserResponseDto) => void;
  fetchMyProfile: () => Promise<UserResponseDto | undefined>;
  clear: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    set => ({
      user: null,
      setUser: (user: UserResponseDto) => set({ user }),
      fetchMyProfile: async () => {
        try {
          const data = await userApi.getMyProfile();
          console.log(data);
          set({ user: data });
          return data;
        } catch (error) {
          console.error(error);
        }
      },
      clear: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
    },
  ),
);
