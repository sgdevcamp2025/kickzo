// ... existing imports ...
import { FriendCardContainer } from '@/components/Friend/FriendCard/index.css';
import { Container, SkeletonBase, SubTitle, Title, Wrapper } from '@/ui/Common.css';
import { FriendGrid } from '../index.css';
import styled from 'styled-components';

export const FriendSkeleton = () => {
  return (
    <Wrapper>
      <Container>
        <Title>친구</Title>
        <SubTitle>친구 목록</SubTitle>
        <FriendGrid>
          {[...Array(9)].map((_, index) => (
            <FriendCardSkeleton key={index} />
          ))}
        </FriendGrid>
      </Container>
    </Wrapper>
  );
};

const FriendCardSkeleton = () => {
  return (
    <SkeletonCard>
      <FriendCardContainer>
        <SkeletonProfile />
        <SkeletonTextContainer>
          <SkeletonTitle />
          <SkeletonText />
        </SkeletonTextContainer>
      </FriendCardContainer>
    </SkeletonCard>
  );
};

const SkeletonCard = styled(SkeletonBase)`
  background: var(--palette-static-white);
  border-radius: 0.625rem;
  animation: shimmer 1.5s infinite;
`;

const SkeletonProfile = styled(SkeletonBase)`
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
`;

const SkeletonTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const SkeletonTitle = styled(SkeletonBase)`
  width: 80%;
  height: 1.5rem;
  border-radius: 5px;
`;

const SkeletonText = styled(SkeletonBase)`
  width: 50%;
  height: 1rem;
  border-radius: 5px;
`;
