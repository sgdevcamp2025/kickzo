import styled, { css } from 'styled-components';
import { ButtonColor } from '@/types/enums/ButtonColor';

/** 버튼 스타일 */
export const StyledButton = styled.button<{
  color: ButtonColor;
  textcolor: string;
  borderradius: string;
  padding: string;
  border: string;
  disabled: boolean;
  width: string;
  height: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ padding }) => padding};
  background-color: ${({ color }) => color};
  color: ${({ textcolor }) => textcolor};
  font-weight: bold;
  font-size: 14px;
  border: ${({ border }) => border};
  border-radius: ${({ borderradius }) => borderradius};
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
      color: #eee;
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
