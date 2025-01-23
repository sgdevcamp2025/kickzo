import { styled } from 'styled-components';

export const ButtonContainer = styled.div`
  padding: 16px;
  width: 72px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  background-color: #f0f0f0;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
  & > a {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &:hover > div {
      background-color: var(--palette-line-solid-normal);
    }
  }
`;

export const ButtonBox = styled.div<{ $isActive: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  background-color: ${({ $isActive }) =>
    $isActive ? 'var(--palette-line-solid-normal)' : 'transparent'};
`;
