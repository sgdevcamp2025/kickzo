import { captureException } from '@sentry/react';
import { AxiosError } from 'axios';
import { useUserStore } from '@/stores/useUserStore';

export const logAxiosError = (error: unknown, type: string, errorMsg: string) => {
  if (error instanceof AxiosError && error.response?.status === 400) return;

  if (error instanceof AxiosError) {
    error.message = errorMsg;
    captureException(error, {
      tags: {
        userId: useUserStore.getState().user?.userId ?? 'anonymous',
        api: error.response?.config.url,
        httpMethod: error.config?.method?.toUpperCase(),
        httpStatusCode: (error.response?.status ?? '').toString(),
      },
      level: 'error',
      extra: { type: type },
    });
  }
};
