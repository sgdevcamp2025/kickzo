import { styled } from 'styled-components';

export const FriendCardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 300px;
`;

export const FriendCardImage = styled.div<{ $isOnline: boolean }>`
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 10px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  &::before {
    content: '';
    position: absolute;
    right: -3px;
    bottom: -3px;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 10px;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    background-color: ${props =>
      props.$isOnline ? 'var(--palette-status-positive)' : 'var(--palette-interaction-inactive)'};
    border-radius: 10px;
    z-index: 2;
  }
`;
