import React, { ChangeEvent } from 'react';
import {
  Container,
  Container__Wrapper,
  Container__Wrapper__Input,
  Container__Wrapper__Btn,
  Container__ErrorMessage,
  Design,
} from './index.css';

/**
 * Input 컴포넌트의 Props 인터페이스
 */
interface IInput {
  /** Input 필드의 HTML 타입 */
  type?: string;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 입력 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 버튼에 표시할 텍스트 */
  buttonLabel?: string;
  /** 버튼 클릭 이벤트 핸들러 */
  onButtonClick?: () => void;
  /** Input 디자인 선택 (INPUT 또는 SEARCH) */
  design?: Design;
}

export const Input: React.FC<IInput> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  buttonLabel,
  onButtonClick,
  design = Design.INPUT,
}) => {
  return (
    <Container>
      <Container__Wrapper design={design}>
        <Container__Wrapper__Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          hasError={!!error}
          design={design}
        />
        {design === Design.INPUT && buttonLabel && (
          <Container__Wrapper__Btn onClick={onButtonClick} disabled={disabled}>
            {buttonLabel}
          </Container__Wrapper__Btn>
        )}
      </Container__Wrapper>
      {error && <Container__ErrorMessage>{error}</Container__ErrorMessage>}
    </Container>
  );
};
