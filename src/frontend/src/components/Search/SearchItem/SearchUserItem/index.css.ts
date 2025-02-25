import { styled } from 'styled-components';

export const SearchItemContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--palette-line-normal-alternative);
`;

export const SearchItemContent = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchItemProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SearchItemNickname = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
`;

export const SearchItemStateMessage = styled.div`
  font-size: 0.875rem;
  color: var(--palette-font-gray-strong);
  margin-top: 0.25rem;
`;
