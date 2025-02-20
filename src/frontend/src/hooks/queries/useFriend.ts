import { friendApi } from '@/api/endpoints/friend/friend.api';
import { useQuery } from '@tanstack/react-query';

export const useFriend = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: () => friendApi.getFriends(),
    staleTime: 1000,
  });
};
