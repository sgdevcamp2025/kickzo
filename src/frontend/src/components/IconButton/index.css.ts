import { styled } from 'styled-components';
import { darkenColor } from '@/utils/colorUtils';

export const CircleButton = styled.button<{ $backgroundColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: ${({ $backgroundColor = 'var(--palette-line-solid-alternative)' }) =>
    $backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${darkenColor('var(--palette-static-white)')};
    opacity: 0.8;
  }

  & > div {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > div > img {
    width: 100%;
  }
`;
