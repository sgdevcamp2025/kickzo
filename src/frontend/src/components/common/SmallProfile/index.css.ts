import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: space-between;
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Profile__Img = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border-radius: 8px;
  overflow: hidden;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ImgWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ImgWrapper_Img = styled.img`
  width: 16px;
  height: 16px;
`;
