import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  50% {
    background: var(--palette-primary);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  user-select: none;
`;

export const Spinner = styled.div`
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--palette-interaction-inactive);
  animation: ${loading} 1.6s infinite ease-in-out;
  animation-delay: 0.4s;

  &:before,
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--palette-interaction-inactive);
    top: 50%;
    transform: translateY(-50%);
    animation: ${loading} 1.6s infinite ease-in-out;
  }

  &:before {
    left: -12px;
  }

  &:after {
    left: 12px;
    animation-delay: 0.8s;
  }
`;
