import { FriendDto } from '@/api/endpoints/friend/friend.interface';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FriendStore {
  friends: FriendDto[];
  fetchFriends: () => Promise<FriendDto[]>;
  updateFriendStatus: (friendId: number, status: string) => void;
  clear: () => void;
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
      updateFriendStatus: (friendId: number, status: string) => {
        set(state => ({
          friends: state.friends.map(friend =>
            friend.friend_id === friendId ? { ...friend, status } : friend,
          ),
        }));
      },
      clear: () => {
        set({ friends: [] });
      },
    }),
    {
      name: 'friend-storage',
    },
  ),
);
