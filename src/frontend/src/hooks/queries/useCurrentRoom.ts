import { useQuery } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';

export const useCurrentRoom = (code: string | null) => {
  return useQuery({
    queryKey: ['currentRoom', code],
    queryFn: () => roomApi.joinRoom(code!),
    enabled: !!code, // code가 있을 때만 쿼리 실행
  });
};
