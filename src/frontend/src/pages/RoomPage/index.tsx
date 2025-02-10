import { Sidebar } from '@/components/Sidebar';
import { YouTubePlayer } from '@/components/YoutubePlayer';
import { RoomDetail } from '@/components/RoomDetail';

import { Container, Wrapper } from './index.css';

export const Room = () => {
  return (
    <>
      <Container>
        <Wrapper>
          <YouTubePlayer />
          <RoomDetail />
        </Wrapper>
        <Sidebar />
      </Container>
    </>
  );
};
