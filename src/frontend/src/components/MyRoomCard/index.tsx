import { MyRoomDto } from '@/types/dto/MyRoom.dto';
import UserIcon from '@/assets/img/UsersLine.svg';
import { useState } from 'react';
import TrashcanIcon from '@/assets/img/Trashcan.svg';
import ShareIcon from '@/assets/img/ShareLink.svg';
import { RoomDeleteModal } from '../Modal/RoomDeleteModal';
import { useNavigate } from 'react-router-dom';
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

export const MyRoomCard = ({ room }: { room: MyRoomDto }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClickDelete, setIsClickDelete] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/room?code=${room.code}`);
  };

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const url = `${window.location.origin}/room?code=${room.code}`;

    try {
      await navigator.clipboard.writeText(url);
      console.log(room.id, '공유');
      alert('링크가 클립보드에 복사되었습니다!'); // 혹은 토스트 메시지
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(room.id, '삭제');
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
          <img src={room.playlistUrl} alt={room.title} />
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
      {isClickDelete && <RoomDeleteModal roomId={room.id} onCancel={handleCancel} />}
    </>
  );
};
