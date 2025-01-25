import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;

  & > form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const TitleBox = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

export const SubTitle = styled.p`
  font-size: 1.125rem;
  color: var(--palette-interaction-inactive);
`;

export const CommonLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const CommonInput = styled.input`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--palette-line-normal-normal);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;
