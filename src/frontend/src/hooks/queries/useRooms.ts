import { useInfiniteQuery } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';
import { RoomDto } from '@/api/endpoints/room/room.interface';

export const useRooms = () => {
  return useInfiniteQuery<RoomDto[], Error>({
    queryKey: ['rooms'],
    queryFn: ({ pageParam }) => roomApi.getRooms(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.length === 20 ? lastPage.length : undefined;
    },
    staleTime: 1000 * 60 * 1, // 1분동안 기존 데이터를 사용
  });
};
