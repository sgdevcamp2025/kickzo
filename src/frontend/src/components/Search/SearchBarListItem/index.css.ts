import { styled } from 'styled-components';

export const Li = styled.li`
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

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

export const Img = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

export const Thumbnail = styled(Img)`
  width: 32px;

  img {
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border: 1px solid var(--palette-font-gray);
  }
`;
