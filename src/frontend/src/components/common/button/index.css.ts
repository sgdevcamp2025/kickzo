import styled, { css } from 'styled-components';

/** 버튼 색상 타입 */
export enum ButtonColor {
  LIGHTGRAY = '#f4f4f4',
  GRAY = '#d4d4d4',
  DARKGRAY = '#444444',
  ORANGE = '#FF9100',
  TRANSPARENT = 'transparent',
}

/** 버튼 스타일 */
export const StyledButton = styled.button<{
  color: ButtonColor;
  textColor: string;
  borderRadius: string;
  padding: string;
  border: string;
  disabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ padding }) => padding};
  background-color: ${({ color }) => color};
  color: ${({ textColor }) => textColor};
  font-weight: bold;
  font-size: 14px;
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: ${({ color, disabled }) =>
      disabled || color === ButtonColor.TRANSPARENT ? color : darkenColor(color)};
    opacity: ${({ color }) =>
      color === ButtonColor.TRANSPARENT ? 0.8 : 1}; /* 투명일 때 hover 효과 */
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: #ccc;
      color: #d4d4d4;
      cursor: not-allowed;
    `}
`;

/** 색상을 어둡게 변환하는 함수 */
const darkenColor = (color: string): string => {
  const [r, g, b] = color
    .match(/\w\w/g)!
    .map(hex => parseInt(hex, 16))
    .map(value => Math.max(0, value - 30)); // 밝기를 줄임
  return `rgb(${r}, ${g}, ${b})`;
};
