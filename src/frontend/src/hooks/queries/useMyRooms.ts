import { useQuery } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';
import { useAuthStore } from '@/stores/useAuthStore';

export const useMyRooms = () => {
  return useQuery({
    queryKey: ['myRooms'],
    queryFn: roomApi.getMyRooms,
    enabled: !!useAuthStore(state => state.accessToken),
  });
};
