import { VideoGridContainer } from './index.css';
import { VideoCard } from '@/components/VideoCard';
import { useNavigate } from 'react-router-dom';
import { useRooms } from '@/hooks/queries/useRooms';
import { useEffect, useState } from 'react';
import { RoomDto } from '@/api/endpoints/room/room.interface';
import { HomeSkeleton } from './HomeSkeleton';
import { useDelayedLoading } from '@/hooks/utils/useDelayedLoading';

export const HomePage = () => {
  const navigate = useNavigate();
  const getRooms = useRooms();
  const showSkeleton = useDelayedLoading(getRooms.data);
  const [videos, setVideos] = useState<RoomDto[]>([]);

  const handleVideoCardClick = (code: string) => {
    navigate(`/room?code=${code}`);
  };

  useEffect(() => {
    if (getRooms.data) {
      setVideos(getRooms.data.pages.flatMap(page => page));
    }
  }, [getRooms.data]);

  if (showSkeleton) {
    return <HomeSkeleton />;
  }

  return (
    <VideoGridContainer>
      {videos.map(video => (
        <VideoCard
          key={video.roomId}
          video={video}
          onClick={() => handleVideoCardClick(video.code)}
        />
      ))}
    </VideoGridContainer>
  );
};
