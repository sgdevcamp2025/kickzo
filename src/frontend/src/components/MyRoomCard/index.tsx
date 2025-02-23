import { useEffect, useState } from 'react';
import UserIcon from '@/assets/img/UsersLine.svg';
import TrashcanIcon from '@/assets/img/Trashcan.svg';
import ShareIcon from '@/assets/img/ShareLink.svg';
import { RoomDeleteModal } from '@/components/Modal/RoomDeleteModal';
import { useNavigate } from 'react-router-dom';
import { MyRoomDto } from '@/api/endpoints/room/room.interface';
import DefaultThumbnail from '@/assets/img/DefaultThumbnail.svg';

import {
  ActionButton,
  ActionButtons,
  Card,
  Creator,
  Info,
  Thumbnail,
  Title,
  UserCount,
} from './index.css';
import { getYoutubeThumbnail } from '@/utils/youtubeUtils';

export const MyRoomCard = ({ room }: { room: MyRoomDto }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClickDelete, setIsClickDelete] = useState(false);
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

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const url = `${window.location.origin}/room?code=${room.code}`;

    try {
      await navigator.clipboard.writeText(url);
      console.log(room.roomId, '공유');
      alert('링크가 클립보드에 복사되었습니다!'); // 혹은 토스트 메시지
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(room.roomId, '삭제');
    setIsClickDelete(true);
  };

  const handleCancel = () => {
    setIsClickDelete(false);
  };

  return (
    <>
      <Card
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Thumbnail>
          <img src={thumbnail} alt={room.title} />
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
        <ActionButtons $isHovered={isHovered}>
          <ActionButton onClick={handleShare}>
            <img src={ShareIcon} alt="공유하기" />
          </ActionButton>
          <ActionButton onClick={handleDelete}>
            <img src={TrashcanIcon} alt="삭제" />
          </ActionButton>
        </ActionButtons>
      </Card>
      {isClickDelete && <RoomDeleteModal roomId={room.roomId} onCancel={handleCancel} />}
    </>
  );
};
