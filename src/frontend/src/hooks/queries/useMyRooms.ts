import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';

export const useMyRooms = () => {
  return useQuery({
    queryKey: ['myRooms'],
    queryFn: useMyRoomsStore.getState().fetchMyRooms,
    enabled: !!useAuthStore(state => state.accessToken),
    staleTime: 0,
  });
};
