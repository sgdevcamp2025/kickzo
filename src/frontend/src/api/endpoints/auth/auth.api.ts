import { useAuthStore } from '@/stores/useAuthStore';
import instance from '../../axios.instance';
import { LoginRequest, LoginResponseDto } from './auth.interface';
import axios from 'axios';
import { ErrorType } from '@/types/enums/ErrorType';
import { logAxiosError } from '@/api/axios.log';

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
    try {
      const { data } = await instance.post('/auth/logout');
      useAuthStore.getState().clear();
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.AUTH, '로그아웃 실패');
      throw error;
    }
  },

  // 토큰 갱신
  refreshToken: async () => {
    try {
      const { data } = await instance.post('/auth/token/refresh');
      return data;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      useAuthStore.getState().clear();
      throw error;
    }
  },

  // 토큰 검증
  verifyToken: async () => {
    const { data } = await instance.post('/auth/token/verify');
    return data;
  },
};
