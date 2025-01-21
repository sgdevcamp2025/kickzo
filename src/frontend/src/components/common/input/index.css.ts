import styled, { css } from 'styled-components';
import { InputDesign } from '@/types/enums/InputDesign';

/** 컨테이너 스타일 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

/** Input Wrapper 스타일 */
export const Wrapper = styled.div<{ design: InputDesign }>`
  display: flex;
  align-items: center;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  padding: 2px;

  ${({ design }) =>
    design === InputDesign.SEARCH &&
    css`
      background-color: #f5f5f5;
      border: none;
    `}
`;

/** Input 필드 스타일 */
export const StyledInput = styled.input<{ iserror: boolean; design: InputDesign }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  border-radius: 4px;

  ${({ design }) =>
    design === InputDesign.SEARCH &&
    css`
      background-color: #f5f5f5;
      font-size: 14px;
      color: #aaa;
    `}

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

/** 버튼 스타일 */
export const Btn = styled.button`
  background: none;
  color: #007bff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  padding: 8px 12px;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;

/** 에러 메시지 스타일 */
export const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
`;
