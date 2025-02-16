import { Sidebar } from '@/components/Sidebar';
import { YouTubePlayer } from '@/components/YoutubePlayer';
import { RoomDetail } from '@/components/RoomDetail';

import { Container, Wrapper } from './index.css';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrentRoom } from '@/hooks/queries/useCurrentRoom';

export const RoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('code');
  const { data: room } = useCurrentRoom(roomCode);
  console.log('RoomPage:', room);

  const { messages } = useCurrentRoomStore(); // NOTE: 채팅 메시지 테스트용

  useEffect(() => {
    if (room) {
      useCurrentRoomStore.getState().setCurrentRoom(room);
      useCurrentRoomStore.getState().subscribeChat(room.roomDetails.roomInfo[0]?.roomId);
    }
  }, [room]);

  return (
    <>
      <Container>
        <Wrapper>
          <YouTubePlayer />
          <RoomDetail />
          {/* NOTE: 채팅 메시지 테스트 용 */}
          {messages && messages.map(message => <p>{message.message}</p>)}
        </Wrapper>
        <Sidebar />
      </Container>
    </>
  );
};
