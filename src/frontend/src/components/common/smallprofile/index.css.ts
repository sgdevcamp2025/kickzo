import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: space-between;
`;

export const Container__Profile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Container__Profile__Img = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 4px;
  border-radius: 8px;
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
