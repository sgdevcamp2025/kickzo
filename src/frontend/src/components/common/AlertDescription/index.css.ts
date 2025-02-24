import { styled } from 'styled-components';

export const AlertDescriptionContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  border: 1px solid var(--palette-line-normal-normal);
  background-color: var(--palette-background-normal-alternative);
  border-radius: 10px;
  padding: 1.5rem;
`;

export const AlertDescriptionImage = styled.div`
  width: 1rem;
  height: 1rem;

  & > img {
    width: 100%;
    height: 100%;
  }
`;

export const AlertDescriptionTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
`;

export const AlertDescriptionTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
