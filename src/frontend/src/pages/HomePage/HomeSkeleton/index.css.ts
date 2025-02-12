import styled, { keyframes } from 'styled-components';

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
  padding: 0.625rem;
  background: var(--palette-static-white);
  border-radius: 0.625rem;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }
`;

export const SkeletonThumbnail = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.625rem;
`;

export const SkeletonContent = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
`;

export const SkeletonProfile = styled(SkeletonBase)`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
`;

export const SkeletonInfo = styled.div`
  width: 100%;
`;

export const SkeletonTitle = styled(SkeletonBase)`
  width: 60%;
  height: 1.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const SkeletonText = styled(SkeletonBase)`
  width: 40%;
  height: 1rem;
  border-radius: 0.25rem;
`;
