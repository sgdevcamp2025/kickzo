import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  padding-right: 16px;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TitleContainer = styled.header`
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: space-between;

  > div {
    display: flex;
    gap: 8px;
  }
`;

export const TitleContainer_Img = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const Username = styled.div`
  color: var(--palette-font-gray-strong);
  margin-top: 8px;
`;

export const DescriptionContainer = styled.div`
  position: relative;
`;

export const Description = styled.div<{ $isExpanded: boolean }>`
  color: var(--palette-font-gray-strong);
  margin-top: 16px;
  max-height: ${({ $isExpanded }) => ($isExpanded ? 'none' : '4.5em')};
  overflow: hidden;
  line-height: 1.5em;
`;

export const TitleContainer_MemberNum = styled.div`
  width: 6rem;
  display: flex;
  background-color: var(--palette-font-gray-strong);
  color: white;
  padding: 8px;
  border-radius: 16px;
  height: 28px;
  align-items: center;
`;

export const Circle = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 100px;
  background-color: red;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: var(--palette-font-gray-strong);
  font-size: 14px;
  cursor: pointer;
  margin-top: 4px;
  text-decoration: underline;
`;
