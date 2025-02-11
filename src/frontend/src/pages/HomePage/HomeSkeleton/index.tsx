import { VideoGridContainer } from '../index.css';
import {
  SkeletonCard,
  SkeletonContent,
  SkeletonInfo,
  SkeletonProfile,
  SkeletonText,
  SkeletonThumbnail,
  SkeletonTitle,
} from './index.css';

export const RoomSkeleton = () => (
  <SkeletonCard>
    <SkeletonThumbnail />
    <SkeletonContent>
      <SkeletonProfile />
      <SkeletonInfo>
        <SkeletonTitle />
        <SkeletonText />
      </SkeletonInfo>
    </SkeletonContent>
  </SkeletonCard>
);

export const HomeSkeleton = () => {
  return (
    <VideoGridContainer>
      {Array.from({ length: 15 }).map((_, i) => (
        <RoomSkeleton key={`home-${i}`} />
      ))}
    </VideoGridContainer>
  );
};
