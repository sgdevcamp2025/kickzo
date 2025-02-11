import { Wrapper, Container, Title, SubTitle } from '../index.css';
import {
  SkeletonCard,
  SkeletonThumbnail,
  SkeletonContent,
  SkeletonTitle,
  SkeletonText,
} from './index.css';

const RoomSkeleton = () => (
  <SkeletonCard>
    <SkeletonThumbnail />
    <SkeletonContent>
      <SkeletonTitle />
      <SkeletonText />
    </SkeletonContent>
  </SkeletonCard>
);

export const MyRoomSkeleton = () => {
  return (
    <Wrapper>
      <Container>
        <Title>내 방</Title>
        <div>
          <SubTitle>내가 만든 방</SubTitle>
          {[1, 2].map(i => (
            <RoomSkeleton key={`created-${i}`} />
          ))}
        </div>
        <div>
          <SubTitle>참여 중인 방</SubTitle>
          {[1, 2, 3].map(i => (
            <RoomSkeleton key={`joined-${i}`} />
          ))}
        </div>
      </Container>
    </Wrapper>
  );
};
