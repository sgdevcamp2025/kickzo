import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';
import { useNavigate } from 'react-router-dom';
import { RoomDto } from '@/api/endpoints/room/room.interface';

export const useRoom = () => {
  const navigate = useNavigate();

  const getRooms = useInfiniteQuery<RoomDto[], Error>({
    queryKey: ['rooms'],
    queryFn: ({ pageParam }) => roomApi.getRooms(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.length === 0 ? undefined : lastPage.length;
    },
  });

  const createRoom = useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: data => {
      navigate(`/room?code=${data.code}`);
    },
  });

  const getMyRooms = useQuery({
    queryKey: ['myRooms'],
    queryFn: roomApi.getMyRooms,
  });

  return {
    getRooms,
    createRoom,
    getMyRooms,
  };
};
