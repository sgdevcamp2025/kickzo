import {
  VideoCardContainer,
  Thumbnail,
  VideoInfo,
  Profile,
  Title,
  Nickname,
  UserCount,
} from './index.css';
import { RoomDto } from '@/api/endpoints/room/room.interface';
import DefaultThumbnail from '@/assets/img/DefaultThumbnail.svg';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import { getYoutubeThumbnail } from '@/utils/youtubeUtils';
import { useEffect, useState } from 'react';
interface IVideoCard {
  video: RoomDto;
  onClick?: () => void;
}

export const VideoCard = ({ video, onClick }: IVideoCard) => {
  const [thumbnail, setThumbnail] = useState<string>(DefaultThumbnail);

  useEffect(() => {
    if (!video.playlistUrl) return;

    const fetchThumbnail = async () => {
      const url = await getYoutubeThumbnail(video.playlistUrl ?? '', 'hq');
      setThumbnail(url ?? DefaultThumbnail);
    };

    fetchThumbnail();
  }, [video.playlistUrl]);

  return (
    <VideoCardContainer onClick={onClick}>
      <Thumbnail $playlistUrl={video.playlistUrl}>
        <UserCount>{video.userCount}명</UserCount>
        <img
          src={thumbnail}
          onError={e => {
            e.currentTarget.src = DefaultThumbnail;
          }}
          alt={video.title}
        />
      </Thumbnail>
      <VideoInfo>
        <Profile>
          <img
            src={video.profileImageUrl ?? DefaultProfile}
            onError={e => {
              e.currentTarget.src = DefaultProfile;
            }}
            alt={video.creator}
          />
        </Profile>
        <div>
          <Title className="clamp-2">{video.title}</Title>
          <Nickname className="clamp-1">{video.creator}</Nickname>
        </div>
      </VideoInfo>
    </VideoCardContainer>
  );
};
