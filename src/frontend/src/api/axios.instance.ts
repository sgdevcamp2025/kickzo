import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    console.log('error 발생!!!! status: ', error.response?.status);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing && refreshPromise) {
        console.log('이미 refresh token 요청 중, 기존 요청 대기');
        return refreshPromise
          .then(newToken => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          })
          .catch(refreshError => Promise.reject(refreshError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          const { data } = await axios
            .create({
              baseURL: import.meta.env.VITE_API_URL,
              withCredentials: true,
            })
            .post('/auth/token/refresh'); // 별도 axios 사용
          localStorage.setItem('access_token', data.accessToken);
          console.log('새로운 토큰 발급 완료!!!!', data.accessToken);

          isRefreshing = false;
          refreshPromise = null;

          return data.accessToken;
        } catch (refreshError) {
          console.log('refreshToken 요청 실패!!!!', refreshError);
          localStorage.removeItem('access_token');
          isRefreshing = false;
          refreshPromise = null;

          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      })();

      return refreshPromise
        .then(newToken => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    return Promise.reject(error);
  },
);

export default instance;
