import { Sidebar } from '@/components/Sidebar';
import { YouTubePlayer } from '@/components/YoutubePlayer';
import { RoomDetail } from '@/components/RoomDetail';

import { Container, Wrapper } from './index.css';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrentRoom } from '@/hooks/queries/useCurrentRoom';
import { useVideoStore } from '@/stores/useVideoStore';
import { getVideoQueueFromPlaylist } from '@/utils/playlistUtils';

export const RoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('code');
  const { data: room } = useCurrentRoom(roomCode);
  console.log('RoomPage:', room);

  useEffect(() => {
    if (room) {
      useCurrentRoomStore.getState().setCurrentRoom(room);
      if (room.roomDetails?.playlist && Array.isArray(room.roomDetails.playlist)) {
        getVideoQueueFromPlaylist(room.roomDetails.playlist)
          .then(videoQueue => {
            useVideoStore.getState().setVideoQueue(videoQueue);
          })
          .catch(err => {
            console.error('playlist 에러', err);
          });
      }
    }
    return () => {
      useCurrentRoomStore.getState().clearCurrentRoom();
    };
  }, [room]);

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
