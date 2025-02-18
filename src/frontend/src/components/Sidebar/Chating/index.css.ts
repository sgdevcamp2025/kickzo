import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  position: relative;
`;

export const ChatScrollArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }
`;

export const ChatMessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
`;

export const ChatMessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChatNickname = styled.span`
  font-weight: bold;
  color: #333;
  font-size: 14px;
`;

export const ChatTime = styled.span`
  font-size: 12px;
  color: #888;
`;

export const ChatText = styled.p`
  font-size: 14px;
  color: #444;
  margin-top: 2px;
`;

export const ChatProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
`;

export const ChatInputField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #888;
  }
`;

export const ChatInputButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: 8px;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const Blank = styled.div<{ $blankPadding: string }>`
  padding-bottom: ${({ $blankPadding }) => $blankPadding};
`;

export const ScrollButton = styled.button`
  position: absolute;
  bottom: 70px;
  right: 15px;
  z-index: 100;
  background-color: var(--palette-primary);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  border: none;
  border-radius: 50%;
  padding: 5px 10px;
  cursor: pointer;
  width: 40px;
  height: 40px;

  & > span {
    position: absolute;
    right: -0.5rem;
    top: -0.5rem;
    background-color: var(--palette-accent-redOrange);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    color: #fff;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
