import { FriendDto } from '@/api/endpoints/friend/friend.interface';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FriendStore {
  friends: FriendDto[];
  fetchFriends: () => Promise<FriendDto[]>;
}

export const useFriendStore = create(
  persist<FriendStore>(
    set => ({
      friends: [],
      fetchFriends: async () => {
        const data = await friendApi.getFriends();
        set({ friends: data });
        return data;
      },
      addFriend: (friend: FriendDto) => {
        set(state => ({ friends: [...state.friends, friend] }));
      },
    }),
    {
      name: 'friend-storage',
    },
  ),
);
