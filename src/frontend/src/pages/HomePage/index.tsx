import { VideoGridContainer } from './index.css';
import { VideoCard } from '@/components/VideoCard';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/hooks/queries/useRoom';
import { useEffect, useState } from 'react';
import { RoomDto } from '@/api/endpoints/room/room.interface';
import { HomeSkeleton } from './HomeSkeleton';

export const HomePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<RoomDto[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const handleVideoCardClick = (code: string) => {
    navigate(`/room?code=${code}`);
  };

  const { getRooms } = useRoom();

  useEffect(() => {
    const minLoadingTime = 300;
    const startTime = Date.now();

    if (getRooms.data) {
      setVideos(getRooms.data.pages.flatMap(page => page));

      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => setShowSkeleton(false), delay);
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
