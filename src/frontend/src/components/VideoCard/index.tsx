import {
  VideoCardContainer,
  Thumbnail,
  VideoInfo,
  Profile,
  Title,
  Nickname,
  UserCount,
} from './index.css';
import { IVideoCard } from '@/types/dto/VideoCard.dto';

interface VideoCardProps {
  video: IVideoCard;
  onClick?: () => void;
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <VideoCardContainer onClick={onClick}>
      <Thumbnail>
        <UserCount>{video.userCount}명</UserCount>
        <img src={video.thumbnail} alt={video.title} />
      </Thumbnail>
      <VideoInfo>
        <Profile>
          <img src={video.profile} alt={video.nickname} />
        </Profile>
        <div>
          <Title className="clamp-2">{video.title}</Title>
          <Nickname className="clamp-1">{video.nickname}</Nickname>
        </div>
      </VideoInfo>
    </VideoCardContainer>
  );
};
