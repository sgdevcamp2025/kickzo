import { styled, keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

export const SkeletonCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  background-color: white;
  border-bottom: 1px solid var(--palette-line-normal-alternative);
`;

export const SkeletonThumbnail = styled(SkeletonBase)`
  width: 124px;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
  border-radius: 0.625rem;
`;

export const SkeletonContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

export const SkeletonTitle = styled(SkeletonBase)`
  height: 1.5rem;
  width: 60%;
  border-radius: 4px;
`;

export const SkeletonText = styled(SkeletonBase)`
  height: 1rem;
  width: 40%;
  border-radius: 4px;
`;
