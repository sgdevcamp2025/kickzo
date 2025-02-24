import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 320px;
  height: calc(100vh - 120px);
  border-radius: 10px;
  border: 1px solid var(--palette-line-solid-neutral);
  overflow: hidden;
`;

export const Nav = styled.nav`
  height: 46px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--palette-line-solid-neutral);
  background-color: #fff;
`;

export const Content = styled.div`
  height: calc(100% - 46px);
`;

export const NavButton = styled.button<{ $active: boolean }>`
  width: 83px;
  padding: 10px;
  background-color: ${({ $active }) =>
    $active ? 'var(--palette-line-solid-alternative)' : 'transparent'};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  padding: 0 8px;
`;

export const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
