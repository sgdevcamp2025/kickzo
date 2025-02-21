import { useFriendStore } from '@/stores/useFriendStore';
import { useQuery } from '@tanstack/react-query';

export const useFriend = () => {
  const { fetchFriends } = useFriendStore();

  return useQuery({
    queryKey: ['friends'],
    queryFn: () => fetchFriends(),
    staleTime: 1000,
  });
};
