import { RoomDto } from '@/api/endpoints/room/room.interface';
import DefaultThumbnail from '@/assets/img/DefaultThumbnail.svg';
import UserIcon from '@/assets/img/UsersLine.svg';
import {
  Card,
  Creator,
  Info,
  Thumbnail,
  Title,
  UserCount,
} from '@/components/MyRoomCard/index.css';
import { getYoutubeThumbnail } from '@/utils/youtubeUtils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchRoomItem = ({ room }: { room: RoomDto }) => {
  const [thumbnail, setThumbnail] = useState<string>(DefaultThumbnail);
  const navigate = useNavigate();

  useEffect(() => {
    if (!room.playlistUrl) return;

    const fetchThumbnail = async () => {
      const url = await getYoutubeThumbnail(room.playlistUrl ?? '', 'default');
      setThumbnail(url ?? DefaultThumbnail);
    };

    fetchThumbnail();
  }, [room.playlistUrl]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/room?code=${room.code}`);
  };

  return (
    <Card onClick={handleClick}>
      <Thumbnail>
        <img
          src={thumbnail}
          onError={e => {
            e.currentTarget.src = DefaultThumbnail;
          }}
          alt={room.title}
        />
      </Thumbnail>
      <Info>
        <div>
          <Title className="clamp-1">{room.title}</Title>
          <Creator className="clamp-1">{room.creator}</Creator>
        </div>
        <UserCount>
          <img src={UserIcon} alt="Users Icon" />
          {room.userCount}
        </UserCount>
      </Info>
    </Card>
  );
};
