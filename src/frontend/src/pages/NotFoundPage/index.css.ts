import { styled } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

export const LogoImg = styled.img`
  width: 150px;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const Message = styled.p`
  margin-bottom: 3rem;
  color: var(--palette-font-gray);
`;
