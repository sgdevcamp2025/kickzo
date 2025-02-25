import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

export const Profile = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 8px;
  border-radius: 10px;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

export const Title__Time = styled.div`
  font-size: 12px;
  color: #888888;
  margin-left: 8px;
`;

export const ChatText = styled.div`
  font-size: 14px;
`;
