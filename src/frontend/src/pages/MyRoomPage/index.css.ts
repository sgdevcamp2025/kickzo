import { styled } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  padding: 1.5rem 0;
`;

export const SubTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  padding: 2rem 0 1rem;
`;

export const CommonParagraph = styled.p`
  font-size: 1rem;
`;
