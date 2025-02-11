import { useMutation } from '@tanstack/react-query';
import { roomApi } from '@/api/endpoints/room/room.api';
import { useNavigate } from 'react-router-dom';

export const useCreateRoom = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: data => {
      navigate(`/room?code=${data.code}`);
    },
    onError: error => {
      alert('방 생성을 실패했습니다.');
      console.error(error);
    },
  });
};
