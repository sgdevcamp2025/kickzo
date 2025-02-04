import { styled } from 'styled-components';

export const Li = styled.li`
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;

  & strong {
    color: var(--palette-primary);
    font-weight: 600;
  }

  &.active {
    color: var(--palette-static-white);
    background-color: var(--palette-primary);
  }
  &.active strong {
    color: var(--palette-static-white);
  }
  &.active path {
    stroke: var(--palette-static-white);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--palette-primary);
      color: var(--palette-static-white);
    }
    &:hover strong {
      color: var(--palette-static-white);
    }
    &:hover path {
      stroke: var(--palette-static-white);
    }
  }
`;
