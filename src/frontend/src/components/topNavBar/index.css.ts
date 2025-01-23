import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background-color: #f0f0f0;
`;

export const LogoBox = styled.div`
  width: 110px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ButtonBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: var(--palette-line-solid-normal);
  }
`;

export const LoginButton = styled.button`
  height: 32px;
  font-size: 1rem;
  border-radius: 2rem;
  color: var(--palette-icon-normal);
  border: 1px solid var(--palette-interaction-inactive);
  transition: background-color 0.3s;
  &:hover {
    background-color: var(--palette-line-solid-normal);
  }
  & > a {
    display: block;
    width: 60px;
    height: 32px;
    cursor: pointer;
    text-align: center;
    line-height: 32px;
  }
`;
