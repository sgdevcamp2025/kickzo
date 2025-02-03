import { create } from 'zustand';

interface IVideoItem {
  id: string;
  start: number;
  thumbnail: string;
  title: string;
  youtuber: string;
}

interface IVideoStore {
  videoQueue: IVideoItem[];
  currentIndex: number;
  addVideo: (video: IVideoItem) => void;
  removeVideo: (index: number) => void;
  moveVideoUp: (index: number) => void;
  moveVideoDown: (index: number) => void;
  setCurrentIndex: (index: number) => void;
}

export const useVideoStore = create<IVideoStore>(set => ({
  videoQueue: [],
  currentIndex: 0,

  addVideo: (video: IVideoItem) =>
    set((state: IVideoStore) => ({
      videoQueue: [...state.videoQueue, video],
    })),

  removeVideo: (index: number) =>
    set((state: IVideoStore) => {
      const updatedQueue = state.videoQueue.filter((_, i) => i !== index);
      return {
        videoQueue: updatedQueue,
        currentIndex: state.currentIndex >= updatedQueue.length ? 0 : state.currentIndex,
      };
    }),

  moveVideoUp: (index: number) =>
    set((state: IVideoStore) => {
      if (index === 0) return state;
      const videoQueue = [...state.videoQueue];
      [videoQueue[index], videoQueue[index - 1]] = [videoQueue[index - 1], videoQueue[index]];
      return { videoQueue };
    }),

  moveVideoDown: (index: number) =>
    set((state: IVideoStore) => {
      if (index >= state.videoQueue.length - 1) return state;
      const videoQueue = [...state.videoQueue];
      [videoQueue[index], videoQueue[index + 1]] = [videoQueue[index + 1], videoQueue[index]];
      return { videoQueue };
    }),

  setCurrentIndex: (index: number) =>
    set((state: IVideoStore) => ({
      currentIndex: index >= 0 && index < state.videoQueue.length ? index : state.currentIndex,
    })),
}));
