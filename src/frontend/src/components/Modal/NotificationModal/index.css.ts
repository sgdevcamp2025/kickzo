import { styled } from 'styled-components';

export const NotiContainer = styled.div`
  position: relative;
  max-height: 260px;
  overflow-y: auto;
`;

export const NotiParagraph = styled.p`
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: var(--palette-interaction-inactive);
  margin: 20px 0 40px;
`;
