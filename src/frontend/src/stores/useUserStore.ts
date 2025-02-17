import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '@/api/endpoints/user/user.api';
import { UpdateUserRequestDto, UserResponseDto } from '@/api/endpoints/user/user.interface';

interface UserStore {
  user: UserResponseDto | null;
  setUser: (user: UserResponseDto) => void;
  fetchMyProfile: () => Promise<UserResponseDto | undefined>;
  updateMyProfile: (
    updateUserRequestDto: UpdateUserRequestDto,
  ) => Promise<UserResponseDto | undefined>;
  clearProfile: () => void;
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
      updateMyProfile: async (updateUserRequestDto: UpdateUserRequestDto) => {
        const data = await userApi.updateMyProfile(updateUserRequestDto);
        set({ user: data });
        return data;
      },
      clearProfile: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
    },
  ),
);
