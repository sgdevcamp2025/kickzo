import { useEffect } from 'react';
import { MyRoomCard } from '@/components/MyRoomCard';
import { Wrapper, Container, Title, SubTitle, CommonParagraph } from '@/ui/Common.css';
import { useUserStore } from '@/stores/useUserStore';
import { MyRoomSkeleton } from './MyRoomSkeleton';
import { useDelayedLoading } from '@/hooks/utils/useDelayedLoading';
import { useMyRooms } from '@/hooks/queries/useMyRooms';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';

export const MyRoomPage = () => {
  const { data } = useMyRooms();
  const { user } = useUserStore();
  const { myRooms, setMyRooms, clearMyRooms } = useMyRoomsStore();
  const showSkeleton = useDelayedLoading(data);

  useEffect(() => {
    if (data) {
      setMyRooms(data);
    } else {
      clearMyRooms();
    }
  }, [clearMyRooms, setMyRooms, data]);

  if (showSkeleton) {
    return <MyRoomSkeleton />;
  }

  return (
    <Wrapper>
      <Container>
        <Title>내 방</Title>
        <div>
          <SubTitle>내가 만든 방</SubTitle>
          {myRooms.filter(room => room.creator === user?.nickname).length > 0 ? (
            myRooms
              .filter(room => room.creator === user?.nickname)
              .map(room => <MyRoomCard key={room.roomId} room={room} />)
          ) : (
            <CommonParagraph>🥹 내가 만든 방이 없습니다.</CommonParagraph>
          )}
        </div>
        <div>
          <SubTitle>참여 중인 방</SubTitle>
          {myRooms.filter(room => room.creator !== user?.nickname).length > 0 ? (
            myRooms
              .filter(room => room.creator !== user?.nickname)
              .map(room => <MyRoomCard key={room.roomId} room={room} />)
          ) : (
            <CommonParagraph>🥹 참여 중인 방이 없습니다.</CommonParagraph>
          )}
        </div>
      </Container>
    </Wrapper>
  );
};
