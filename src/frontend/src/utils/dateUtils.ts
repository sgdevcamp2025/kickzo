export const formatDateToKorean = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
};
