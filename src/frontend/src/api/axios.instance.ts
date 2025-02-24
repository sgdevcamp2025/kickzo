import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { logAxiosError } from './axios.log';
import { ErrorType } from '@/types/enums/ErrorType';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().accessToken;
    console.log('token', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await useAuthStore.getState().refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }
        return Promise.reject(error);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      logAxiosError(error, ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
    return Promise.reject(error);
  },
);

export default instance;
