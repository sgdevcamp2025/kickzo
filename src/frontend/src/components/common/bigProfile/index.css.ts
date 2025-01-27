import styled from 'styled-components';

export const Container = styled.div`
  width: 260px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 10px 10px 40px 0px #00000040;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Profile__Header = styled.div`
  display: flex;

  justify-content: space-between;
`;

export const Profile__Header__Img = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 10px;
`;

export const Profile__Header__ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const Profile__Nickname = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
