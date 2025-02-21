import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useToastStore } from '@/stores/useToastStore';
import { ButtonContainer, CloseButton, Toast, ToastButton, ToastContainer } from './index.css';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {children}
      <ToastContainer>
        {toasts.map(({ id, message, type, buttons }) => (
          <Toast key={id} $type={type}>
            <span>{message}</span>
            <ButtonContainer>
              {buttons?.map((button, index) => (
                <ToastButton key={index} onClick={button.onClick}>
                  {button.label}
                </ToastButton>
              ))}
            </ButtonContainer>
            <CloseButton onClick={() => removeToast(id)} className="close-button">
              <X size={18} />
            </CloseButton>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
};
