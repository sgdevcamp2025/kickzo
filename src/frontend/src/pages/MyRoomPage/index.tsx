import { useEffect, useState } from 'react';
import { MyRoomCard } from '@/components/MyRoomCard';
import { Wrapper, Container, Title, SubTitle, CommonParagraph } from './index.css';
import { useUserStore } from '@/stores/useUserStore';
import { MyRoomDto } from '@/api/endpoints/room/room.interface';
import { MyRoomSkeleton } from './MyRoomSkeleton';
import { useDelayedLoading } from '@/hooks/utils/useDelayedLoading';
import { useMyRooms } from '@/hooks/queries/useMyRooms';

export const MyRoomPage = () => {
  const getMyRooms = useMyRooms();
  const { user } = useUserStore();
  const [myRoomList, setMyRoomList] = useState<MyRoomDto[]>([]);
  const showSkeleton = useDelayedLoading(getMyRooms.data);

  useEffect(() => {
    getMyRooms.refetch().then(({ data }) => {
      if (data) {
        setMyRoomList(data);
      }
    });
  }, [getMyRooms]);

  if (showSkeleton) {
    return <MyRoomSkeleton />;
  }

  return (
    <Wrapper>
      <Container>
        <Title>내 방</Title>
        <div>
          <SubTitle>내가 만든 방</SubTitle>
          {myRoomList.filter(room => room.creator === user?.nickname).length > 0 ? (
            myRoomList
              .filter(room => room.creator === user?.nickname)
              .map(room => <MyRoomCard key={room.roomId} room={room} />)
          ) : (
            <CommonParagraph>🥹 내가 만든 방이 없습니다.</CommonParagraph>
          )}
        </div>
        <div>
          <SubTitle>참여 중인 방</SubTitle>
          {myRoomList.filter(room => room.creator !== user?.nickname).length > 0 ? (
            myRoomList
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
