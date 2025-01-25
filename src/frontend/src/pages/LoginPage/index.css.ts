import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const SubTitle = styled.p`
  font-size: 1.125rem;
  margin: 1.875rem 0;
`;

export const CommonInput = styled.input`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  border: 1px solid var(--palette-line-normal-normal);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;

export const IdSaveCheckBox = styled.label`
  margin: 10px 0 30px;
  display: flex;
  gap: 4px;
  cursor: pointer;
`;

export const LinkBox = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 2rem;

  & > a {
    position: relative;
    cursor: pointer;
    font-size: 0.875rem;
  }

  & > a:first-child::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 0.75rem;
    background-color: var(--palette-line-normal-normal);
  }
`;
