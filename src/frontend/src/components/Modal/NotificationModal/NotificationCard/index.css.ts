import { styled } from 'styled-components';

export const Card = styled.div`
  background: var(--palette-static-white);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: var(--palette-background-normal-alternative);
  box-shadow: var(--palette-elevation-shadow-light);
`;

export const Message = styled.p`
  font-size: 14px;
  margin: 0 0 5px;
`;

export const Strong = styled.strong`
  font-weight: 600;
`;

export const Date = styled.span`
  font-size: 12px;
  color: var(--palette-interaction-inactive);
`;

export const ButtonWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: end;
  gap: 0.5rem;
`;

export const AcceptButton = styled.button`
  padding: 0.375rem 1rem;
  background: var(--palette-primary-normal);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: var(--palette-primary-strong);
  }

  &:disabled {
    background: var(--palette-interaction-inactive);
    cursor: default;
  }
`;

export const RejectButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--palette-static-white);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: var(--palette-fill-normal);
  }
  &:disabled {
    background: var(--palette-static-white);
    cursor: default;
  }
`;
