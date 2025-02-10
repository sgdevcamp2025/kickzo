import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
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
  position: relative;
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
  background: var(--palette-static-white);
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

export const ProfileButton = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: var(--palette-static-white);
  border: 1px solid var(--palette-interaction-inactive);
  overflow: hidden;
  cursor: pointer;
`;
