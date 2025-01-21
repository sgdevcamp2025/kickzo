import { ChangeEvent } from 'react';
import { Container, Wrapper, StyledInput, Btn, ErrorMessage } from './index.css';
import { InputDesign } from '@/types/enums/InputDesign';

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
  design?: InputDesign;
}

export const CommonInput = (props: IInput) => {
  return (
    <Container>
      <Wrapper design={props.design || InputDesign.INPUT}>
        <StyledInput
          type={props.type || 'text'}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled || false}
          hasError={!!props.error}
          design={props.design || InputDesign.INPUT}
        />
        {props.design === InputDesign.INPUT && props.buttonLabel && (
          <Btn onClick={props.onButtonClick} disabled={props.disabled || false}>
            {props.buttonLabel}
          </Btn>
        )}
      </Wrapper>
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Container>
  );
};
