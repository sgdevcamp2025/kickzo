import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth/auth.api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

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
    onSuccess: () => {
      useAuthStore.getState().clear();
      navigate('/');
    },
  });

  return {
    login,
    logout,
  };
};
