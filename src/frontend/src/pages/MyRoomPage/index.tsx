import { useEffect } from 'react';
import { MyRoomCard } from '@/components/MyRoomCard';
import { Wrapper, Container, Title, SubTitle } from '@/ui/Common.css';
import { useUserStore } from '@/stores/useUserStore';
import { MyRoomSkeleton } from './MyRoomSkeleton';
import { useDelayedLoading } from '@/hooks/utils/useDelayedLoading';
import { useMyRooms } from '@/hooks/queries/useMyRooms';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';
import { AlertDescription } from '@/components/common/AlertDescription';

export const MyRoomPage = () => {
  const { data } = useMyRooms();
  const { user } = useUserStore();
  const { myRooms, setMyRooms, clearMyRooms, resetNewChatCount } = useMyRoomsStore();
  const showSkeleton = useDelayedLoading(data);

  useEffect(() => {
    if (data) {
      setMyRooms(data);
      resetNewChatCount();
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
            <AlertDescription
              title="아직 만든 방이 없어요"
              description="새로운 방을 만들어서 다른 사람들과 함께 이야기를 나눠보세요."
            />
          )}
        </div>
        <div>
          <SubTitle>참여 중인 방</SubTitle>
          {myRooms.filter(room => room.creator !== user?.nickname).length > 0 ? (
            myRooms
              .filter(room => room.creator !== user?.nickname)
              .map(room => <MyRoomCard key={room.roomId} room={room} />)
          ) : (
            <AlertDescription
              title="참여 중인 방이 없어요"
              description="다른 사람들이 만든 방에 참여해서 대화를 시작해보세요."
            />
          )}
        </div>
      </Container>
    </Wrapper>
  );
};
