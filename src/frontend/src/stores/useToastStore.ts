import { create } from 'zustand';

interface ToastButton {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  duration?: number;
  buttons?: ToastButton[];
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: 'info' | 'success' | 'error', duration?: number, buttons?: ToastButton[], id?: number) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 3000, buttons, id = Date.now()) => {
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration, buttons }] }));

    if (duration) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));
