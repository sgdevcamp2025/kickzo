import { styled } from 'styled-components';

export const VideoCardContainer = styled.div`
  padding: 0.625rem;
  background: var(--palette-static-white);
  border-radius: 0.625rem;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }
`;

export const Thumbnail = styled.div`
  width: 100%;
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

export const UserCount = styled.div`
  position: absolute;
  right: 0.625rem;
  bottom: 0.625rem;
  padding: 0.25rem 0.625rem 0.25rem 1.125rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  color: var(--palette-static-white);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    left: 0.625rem;
    top: 50%;
    width: 0;
    height: 0;
    width: 0.25rem;
    height: 0.25rem;
    transform: translateY(-50%);
    background: var(--palette-status-negative);
    border-radius: 50%;
  }
`;
export const VideoInfo = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
`;

export const Profile = styled.div`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  overflow: hidden;

  & > img {
    min-width: 100%;
    height: 100%;
  }
`;

export const Title = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  font-weight: 500;
`;

export const Nickname = styled.p`
  margin-top: 0.125rem;
  font-size: 0.875rem;
  line-height: 1.25;
  color: var(--palette-font-gray);
`;
