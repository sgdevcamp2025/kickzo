import axios from 'axios';
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
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';

export const RoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('code');
  const { data: room } = useCurrentRoom(roomCode);
  console.log('RoomPage:', room);
  const { setVideoQueue } = useVideoStore();
  const { subscribeRoomPlaylistUpdate } = useWebSocketStore();
  const roomId = useCurrentRoomStore(state => state.roomId);

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
      if (roomId) {
        useMyRoomsStore.getState().subscribeRoom(roomId);
      }
    };
  }, []);

  // YouTube API를 이용하여 영상 정보(제목 & 유튜버) 가져오기
  const fetchVideoDetails = async (videoIds: string[]) => {
    if (!videoIds.length) return {};

    try {
      const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet',
          id: videoIds.join(','),
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
          hl: 'ko',
        },
      });

      const videoDetailsMap: Record<string, { title: string; youtuber: string }> = {};
      data.items.forEach(
        (item: { id: string; snippet: { title: string; channelTitle: string } }) => {
          videoDetailsMap[item.id] = {
            title: item.snippet.title,
            youtuber: item.snippet.channelTitle,
          };
        },
      );

      return videoDetailsMap;
    } catch (error) {
      console.error('YouTube API 호출 실패:', error);
      return {};
    }
  };

  // 방의 플레이리스트 업데이트 구독
  useEffect(() => {
    if (!roomId) return;

    subscribeRoomPlaylistUpdate(roomId, async data => {
      console.log('플레이리스트 업데이트 수신:', data);

      if (data?.playlist && Array.isArray(data.playlist)) {
        const sortedPlaylist = data.playlist.sort((a, b) => a.order - b.order);

        const videoIds = sortedPlaylist
          .map(item => {
            return item.url.split('v=')[1]?.split('&')[0] || '';
          })
          .filter(id => id);

        const videoDetailsMap = await fetchVideoDetails(videoIds);

        const updatedQueue = sortedPlaylist.map(item => {
          const videoId = item.url.split('v=')[1]?.split('&')[0] || '';
          return {
            id: videoId,
            start: parseInt(item.url.split('t=')[1] || '0', 10),
            thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
            title: item.title || videoDetailsMap[videoId]?.title || '제목 없음',
            youtuber: item.youtuber || videoDetailsMap[videoId]?.youtuber || '유튜버 정보 없음',
          };
        });
        setVideoQueue(updatedQueue);
      }
    });
  }, [roomId, subscribeRoomPlaylistUpdate, setVideoQueue]);

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
