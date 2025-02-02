import { VideoGridContainer } from './index.css';
import { VideoCard } from '@/components/VideoCard';
import { IVideoCard } from '@/types/dto/VideoCard.dto';
import { videoListTest } from '@/assets/data/videoListTest';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const videos: IVideoCard[] = videoListTest;

  const handleVideoCardClick = (videoId: string) => {
    navigate(`/room?code=${videoId}`);
  };

  return (
    <VideoGridContainer>
      {videos.map(video => (
        <VideoCard key={video.id} video={video} onClick={() => handleVideoCardClick(video.code)} />
      ))}
    </VideoGridContainer>
  );
};
