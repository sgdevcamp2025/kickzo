import { useInfiniteQuery } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';
import { RoomDto } from '@/api/endpoints/room/room.interface';

export const useRooms = () => {
  return useInfiniteQuery<RoomDto[], Error>({
    queryKey: ['rooms'],
    queryFn: ({ pageParam }) => roomApi.getRooms(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.length === 0 ? undefined : lastPage.length;
    },
  });
};
