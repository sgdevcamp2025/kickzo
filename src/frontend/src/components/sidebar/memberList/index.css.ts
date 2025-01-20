import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Container__UserList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MemberFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 0;

  border-top: 1px solid #d4d4d4;
`;

export const VoiceChatFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 0px;
  border-top: 1px solid #d4d4d4;
`;

export const ActionButton = styled.button`
  border: none;
  padding: 10px;
  border-radius: 50%;
  background-color: #f4f4f4;
  cursor: pointer;
`;

export const JoinButton = styled.button`
  width: 194px;
  border: none;
  background-color: #ff9100;
  padding: 10px 20px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
`;
