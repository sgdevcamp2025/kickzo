import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 332px;
  height: 931px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
`;

export const Nav = styled.nav`
  height: 40px;
  display: flex;
  justify-content: space-between;
`;

export const Content = styled.div`
  height: calc(100% - 40px);
`;

export const NavButton = styled.button<{ active: boolean }>`
  width: 83px;
  padding: 10px;
  background-color: ${({ active }) => (active ? '#ddd' : '#f0f0f0')};
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
