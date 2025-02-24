import { styled } from 'styled-components';

export const NotiContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 260px;
  padding: 20px 20px 0px 20px;
  overflow-y: auto;
`;

export const NotiTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 10px 0;
`;

export const NotiParagraph = styled.p`
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: var(--palette-interaction-inactive);
  margin: 20px 0 40px;
`;
