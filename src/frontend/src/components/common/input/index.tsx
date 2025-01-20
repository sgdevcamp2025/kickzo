import { ChangeEvent } from 'react';
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

export const Input = (props: IInput) => {
  return (
    <Container>
      <Container__Wrapper design={props.design || Design.INPUT}>
        <Container__Wrapper__Input
          type={props.type || 'text'}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled || false}
          hasError={!!props.error}
          design={props.design || Design.INPUT}
        />
        {props.design === Design.INPUT && props.buttonLabel && (
          <Container__Wrapper__Btn onClick={props.onButtonClick} disabled={props.disabled || false}>
            {props.buttonLabel}
          </Container__Wrapper__Btn>
        )}
      </Container__Wrapper>
      {props.error && <Container__ErrorMessage>{props.error}</Container__ErrorMessage>}
    </Container>
  );
};
