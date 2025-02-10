import instance from '../../axios.instance';
import { LoginRequest, LoginResponseDto } from './auth.interface';

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest) => {
    const basicToken = btoa(`${credentials.email}:${credentials.password}`);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    const { data } = await instance.post<LoginResponseDto>(
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
    return data;
  },
};
