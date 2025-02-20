import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useVideoStore } from '@/stores/useVideoStore';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { useWebSocketStore } from '@/stores/useWebSocketStore';

export const YouTubePlayer = () => {
  const { videoQueue, currentIndex } = useVideoStore();
  const { currentRoom } = useCurrentRoomStore();
  const { client, subTopic } = useWebSocketStore();
  const pubTopic = useWebSocketStore.getState().pubTopic;
  const roomId = currentRoom?.roomDetails?.roomInfo?.[0]?.roomId;

  const playerRef = useRef<YT.Player | null>(null);
  const lastSentStateRef = useRef<'playing' | 'paused' | null>(null);
  const isRemoteUpdateRef = useRef<boolean>(false);

  // 이전 영상의 id를 기억
  const previousVideoIdRef = useRef<string | null>(null);

  // 유튜브 API 스크립트 동적 로드
  useEffect(() => {
    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }
  }, []);

  // 유튜브 플레이어 로드
  const loadPlayer = (id: string, startTime: number = 0) => {
    if ((window as any).YT && id) {
      if (playerRef.current) {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById({
            videoId: id,
            startSeconds: startTime,
          });
        }
      } else {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: id,
          playerVars: { autoplay: 1, controls: 1, start: startTime },
          events: {
            onStateChange: handleVideoStateChange,
            onReady: handlePlayerReady,
          },
        });
      }
    }
  };

  // 플레이어 준비 완료 시 실행
  const handlePlayerReady = (event: YT.PlayerEvent) => {
    playerRef.current = event.target;
  };

  // 유튜브 영상의 재생, 멈춤, 끝남 상태에 따라 동작
  const broadcastPlayerState = (state: 'playing' | 'paused', time: number) => {
    if (!client || !roomId || !pubTopic) {
      console.warn('⚠ WebSocket 준비 안됨');
      return;
    }
    lastSentStateRef.current = state;
    const message = { roomId, playTime: time, playerState: state };
    pubTopic(`/app/play-time`, message);
  };

  // 내부 이벤트로 인한 상태 변화 감지
  const handleVideoStateChange = (event: YT.OnStateChangeEvent) => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }
    if (!playerRef.current) return;

    const playTime = playerRef.current.getCurrentTime();
    if (event.data === (window as any).YT.PlayerState.PLAYING) {
      if (lastSentStateRef.current !== 'playing') {
        broadcastPlayerState('playing', playTime);
      }
    } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
      if (lastSentStateRef.current !== 'paused') {
        broadcastPlayerState('paused', playTime);
      }
    }
  };

  // 서버에서 play-time 메시지 수신 → 동기화
  useEffect(() => {
    if (!roomId) return;

    subTopic(`/topic/room/${roomId}/play-time`, (data: any) => {
      isRemoteUpdateRef.current = true;
      applySyncState(data);
    });
  }, [roomId, subTopic]);

  // 서버에서 받은 동기화 적용
  const applySyncState = ({ playTime, playerState }: { playTime: number; playerState: string }) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(playTime, true);

    if (playerState === 'playing') {
      playerRef.current.playVideo();
    } else if (playerState === 'paused') {
      playerRef.current.pauseVideo();
    }
    lastSentStateRef.current = playerState as 'playing' | 'paused';
  };

  // 영상 변경 시 플레이어 로드
  useEffect(() => {
    if (!videoQueue.length) return;

    const currentVideo = videoQueue[currentIndex];
    if (!currentVideo) return;

    // 이전 영상 id와 비교
    const prevId = previousVideoIdRef.current;
    const newId = currentVideo.id;

    // videoId가 달라졌을 때만 로드
    if (prevId !== newId) {
      console.log('🎬 loadPlayer (video changed): ', newId, currentVideo.start);
      loadPlayer(newId, currentVideo.start);
      previousVideoIdRef.current = newId;
    } else {
      // 동일 영상 id라면 재생 다시 시작 안 함
      console.log('같은 영상입니다');
    }
  }, [videoQueue, currentIndex]);

  return (
    <Container>
      <VideoWrapper>
        <div id="youtube-player"></div>
      </VideoWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const VideoWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
