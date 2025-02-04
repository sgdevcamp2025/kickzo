import { styled } from 'styled-components';

export const CommonInput = styled.input`
  width: 100%;
  padding: 0.625rem;
  margin: 0.625rem 0 1.25rem;
  background: var(--palette-fill-normal);
  border: 1px solid var(--palette-line-normal-normal);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--palette-font-gray);
  outline: none;

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;

export const PrivacyToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
`;

export const PrivacyButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 0.625rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 400;
  gap: 0.25rem;
  border: ${({ $active }) =>
    $active
      ? '1px solid var(--palette-icon-normal)'
      : '1px solid var(--palette-line-normal-normal)'};
  background: ${({ $active }) => ($active ? 'var(--palette-icon-normal)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--palette-icon-normal)')};
  cursor: pointer;
`;
