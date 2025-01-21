import React from 'react';
import { StyledButton } from './index.css';
import { ButtonColor } from '@/types/enums/ButtonColor';

/**
 * 버튼 컴포넌트 Props 인터페이스
 */
interface IButton {
  /** 버튼 색상 */
  color: ButtonColor;
  /** 글자 색상 (기본값: 흰색) */
  textcolor?: string;
  /** 버튼 내부 패딩 */
  padding?: string;
  /** 버튼의 border-radius 값 (기본값: 5px) */
  borderradius?: string;
  /** 버튼의 border */
  border?: string;
  /** 버튼 클릭 핸들러 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 버튼 내부 콘텐츠 (텍스트 또는 이미지) */
  children?: React.ReactNode;
  /** 버튼 비활성화 상태 */
  disabled?: boolean;
  /** 버튼의 넓이 */
  width?: string;
  /** 버튼의 높이 */
  height?: string;
}

export const CommonButton = (props: IButton) => {
  return (
    <StyledButton
      color={props.color}
      textcolor={props.textcolor || 'white'}
      padding={props.padding || '0px'}
      borderradius={props.borderradius || '4px'}
      border={props.border || 'none'}
      onClick={props.disabled ? undefined : props.onClick}
      disabled={props.disabled || false}
      width={props.width || 'auto'}
      height={props.height || 'auto'}
    >
      {props.children}
    </StyledButton>
  );
};
