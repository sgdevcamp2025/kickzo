import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & > form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & > form > div {
    margin-bottom: 0.75rem;
  }
`;

export const SubTitle = styled.p`
  font-size: 1.125rem;
  margin: 1.875rem 0;
`;

export const CommonLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const InputBox = styled.div`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--palette-line-normal-normal);

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }

  & > input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 1rem;
  }

  & > button {
    min-width: 70px;
    height: 100%;
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 2px 6px;
    cursor: pointer;
    background-color: transparent;
    color: var(--palette-primary-normal);
    &:disabled {
      color: var(--palette-label-disable);
    }
  }
`;

export const CommonInput = styled.input<{ $isValid?: boolean }>`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  border: ${({ $isValid = true }) =>
    $isValid
      ? '1px solid var(--palette-line-normal-normal)'
      : '1px solid var(--palette-status-negative)'};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;

export const IdSaveCheckBox = styled.label`
  margin: 10px 0 40px;
  display: flex;
  gap: 4px;
  cursor: pointer;

  & > span {
    font-weight: 600;
    text-decoration: underline;
  }
`;

export const WarningMessage = styled.p<{ $isVisible: boolean }>`
  font-size: 0.75rem;
  color: var(--palette-status-negative);
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`;
