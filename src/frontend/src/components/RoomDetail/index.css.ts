import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

export const TitleContainer_Img = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
`;

export const TextContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.2em;
  max-height: 2.4em;
`;

export const Username = styled.div`
  color: var(--palette-font-gray-strong);
  font-size: 14px;
`;

export const DescriptionContainer = styled.div`
  position: relative;
`;

export const Description = styled.div<{ $isExpanded: boolean }>`
  color: var(--palette-font-gray-strong);
  font-size: 14px;
  margin-top: 0.5rem;
  max-height: ${({ $isExpanded }) => ($isExpanded ? 'none' : '4.5em')};
  overflow: hidden;
  line-height: 1.5em;
  display: -webkit-box;
  -webkit-line-clamp: ${({ $isExpanded }) => ($isExpanded ? 'none' : '3')};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-all;
`;

export const MemberCount = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 16px;
  height: 28px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

export const Circle = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 100px;
  background-color: var(--palette-status-negative);
  margin-right: 4px;
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
