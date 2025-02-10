import { useAuthStore } from '@/stores/useAuthStore';
import instance from '../../axios.instance';
import { LoginRequest, LoginResponseDto } from './auth.interface';
import axios from 'axios';

const loginInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest) => {
    const basicToken = btoa(`${credentials.email}:${credentials.password}`);
    useAuthStore.getState().clear();
    const { data } = await loginInstance.post<LoginResponseDto>(
      '/auth/login',
      { device: 'web' },
      {
        headers: {
          Authorization: `Basic ${basicToken}`,
        },
      },
    );
    return data;
  },

  // 로그아웃
  logout: async () => {
    const { data } = await instance.post('/auth/logout');
    useAuthStore.getState().clear();
    return data;
  },

  // 토큰 갱신
  refreshToken: async () => {
    const { data } = await instance.post('/auth/token/refresh');
    return data;
  },
};
