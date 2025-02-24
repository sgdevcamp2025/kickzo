import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth/auth.api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { useUserStore } from '@/stores/useUserStore';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';
import { useFriendStore } from '@/stores/useFriendStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export const useAuth = () => {
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      useAuthStore.getState().setAccessToken(data.accessToken);
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Login failed:', error.message);
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onError: (error: Error) => {
      console.error('Logout failed:', error.message);
    },
    onSettled: () => {
      useAuthStore.getState().clear();
      useFriendStore.getState().clear();
      useNotificationStore.getState().clear();
      useMyRoomsStore.getState().clearMyRooms();
      useUserStore.getState().clearProfile();
      useWebSocketStore.getState().disconnect();
      navigate('/');
    },
  });

  return {
    login,
    logout,
  };
};
