import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 90px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
`;

interface ToastProps {
  $type: 'info' | 'success' | 'error';
}

export const Toast = styled.div<ToastProps>`
  background: ${({ $type }) =>
    $type === 'success' ? '#4caf50' : $type === 'error' ? '#f44336' : '#333'};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  animation: ${fadeIn} 0.3s ease-in-out;
  min-width: 250px;
  &:hover button.close-button {
    color: var(--palette-line-normal-normal);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 1rem;
`;

export const ToastButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--palette-line-normal-normal);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  &:hover {
    color: white !important;
  }
`;
