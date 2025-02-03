import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export const ModalPortal = ({ children }: { children: ReactNode }) => {
  const el = document.getElementById('modal-portal') as HTMLElement;
  return createPortal(children, el);
};
