import { styled } from 'styled-components';

export const VideoGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  padding: 1.25rem;
`;
