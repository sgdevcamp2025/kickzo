import { useMutation, useQuery } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';
import { useNavigate } from 'react-router-dom';

export const useRoom = () => {
  const navigate = useNavigate();

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
    createRoom,
    getMyRooms,
  };
};
