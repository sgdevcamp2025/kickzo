import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 데이터 가져오기 실패 시 재시도 (기본 3번)
      refetchOnWindowFocus: false, // 브라우저 창을 다시 활성화 했을 때 데이터 가져오기 (기본 true)
      staleTime: 5 * 60 * 1000, // 5분동안 캐시된 데이터 사용
    },
  },
});
