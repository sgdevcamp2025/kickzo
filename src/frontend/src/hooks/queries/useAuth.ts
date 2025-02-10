import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints/auth/auth.api';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Login failed:', error.message);
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/');
    },
  });

  return {
    login,
    logout,
  };
};
