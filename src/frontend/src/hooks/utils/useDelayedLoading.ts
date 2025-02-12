import { useState, useEffect } from 'react';

/**
 * 데이터가 로드되기 전에 스켈레톤을 보여주는 훅
 * @param data 데이터
 * @param minLoadingTime 최소 로딩 시간
 * @returns 스켈레톤 여부
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDelayedLoading = (data: any, minLoadingTime: number = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    if (data) {
      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => setShowSkeleton(false), delay);
    } else {
      setShowSkeleton(true);
    }
  }, [data, minLoadingTime]);

  return showSkeleton;
};
