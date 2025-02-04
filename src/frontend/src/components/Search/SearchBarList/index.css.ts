import { styled } from 'styled-components';

export const Ul = styled.ul`
  position: absolute;
  top: 50px;
  left: 0;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  background-color: var(--palette-static-white);
  box-shadow: var(--palette-elevation-shadow-strong);
  opacity: 0.9;
  z-index: 100;
`;

export const TotalLi = styled.li`
  font-size: 0.875rem;
  color: var(--gray-line-btn-color);
  text-align: right;
  padding: 10px;
`;
