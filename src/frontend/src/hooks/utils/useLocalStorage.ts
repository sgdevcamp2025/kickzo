import { useState, useEffect } from 'react';

/**
 * 로컬 스토리지와 React 상태를 동기화하는 커스텀 훅
 *
 * @template T - 저장할 값의 타입
 * @param {string} key - 로컬 스토리지에 저장할 키 값
 * @param {T} initialValue - 초기값 (로컬 스토리지에 값이 없을 때 사용)
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} - [값, 값 설정 함수] 튜플 반환
 *
 * @example
 * const [userPreferences, setUserPreferences] = useLocalStorage('userPreferences', {
 *   theme: 'light',
 *   fontSize: 14,
 *   notificationsEnabled: true
 * });
 *
 * // 값 사용
 * console.log(userPreferences.theme); // 'light' 또는 저장된 값
 *
 * // 값 업데이트
 * setUserPreferences(prev => ({ ...prev, theme: 'dark' })); // 로컬 스토리지와 상태 동시 업데이트
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error parsing localStorage value:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
