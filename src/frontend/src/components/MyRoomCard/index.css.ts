import { styled } from 'styled-components';

export const Card = styled.div`
  display: flex;
  align-items: stretch;
  padding: 0.625rem 0;
  border-bottom: 1px solid #ddd;
  position: relative;
  cursor: pointer;
`;

export const Thumbnail = styled.div`
  width: 124px;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
  border-radius: 0.625rem;
  overflow: hidden;
  position: relative;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Info = styled.div`
  flex: 1;
  padding: 0.25rem 0;
  margin-left: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Title = styled.h3`
  margin-bottom: 0.375rem;
  font-size: 1rem;
  font-weight: bold;
`;

export const Creator = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--palette-font-gray-strong);
`;

export const UserCount = styled.p`
  font-size: 0.875rem;

  & > img {
    margin-right: 0.25rem;
  }
`;

export const ActionButtons = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  padding: 0.25rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  opacity: ${({ $isHovered }) => ($isHovered ? 1 : 0)};
  visibility: ${({ $isHovered }) => ($isHovered ? 'visible' : 'hidden')};
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s ease-in-out;
`;

export const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: none;
  cursor: pointer;

  & > img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;
