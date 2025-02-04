import { myRoomListTest } from '@/assets/data/myRoomListTest';
import { MyRoomCard } from '@/components/MyRoomCard';
import { MyRoomDto } from '@/types/dto/MyRoom.dto';
import { Wrapper, Container, Title, SubTitle, CommonParagraph } from './index.css';

export const MyRoomPage = () => {
  const myRooms: MyRoomDto[] = myRoomListTest;

  const userInfo = {
    id: 1,
    nickname: '니노',
    profileImageUrl: 'https://picsum.photos/40/40?random=1',
  };

  const myRoomList = myRooms;

  return (
    <Wrapper>
      <Container>
        <Title>내 방</Title>
        <div>
          <SubTitle>내가 만든 방</SubTitle>
          {myRoomList.filter(room => room.creator === userInfo.nickname).length > 0 ? (
            myRoomList
              .filter(room => room.creator === userInfo.nickname)
              .map(room => <MyRoomCard key={room.id} room={room} />)
          ) : (
            <CommonParagraph>🥹 내가 만든 방이 없습니다.</CommonParagraph>
          )}
        </div>
        <div>
          <SubTitle>참여 중인 방</SubTitle>
          {myRoomList.filter(room => room.creator !== userInfo.nickname).length > 0 ? (
            myRoomList
              .filter(room => room.creator !== userInfo.nickname)
              .map(room => <MyRoomCard key={room.id} room={room} />)
          ) : (
            <CommonParagraph>🥹 참여 중인 방이 없습니다.</CommonParagraph>
          )}
        </div>
      </Container>
    </Wrapper>
  );
};
