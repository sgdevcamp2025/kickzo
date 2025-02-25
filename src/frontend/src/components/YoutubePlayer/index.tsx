import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useVideoStore } from '@/stores/useVideoStore';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { useWebSocketStore } from '@/stores/useWebSocketStore';

export const YouTubePlayer = () => {
  const { videoQueue } = useVideoStore();
  const { currentRoom } = useCurrentRoomStore();
  const { client, subTopic } = useWebSocketStore();
  const pubTopic = useWebSocketStore.getState().pubTopic;
  const roomId = currentRoom?.roomDetails?.roomInfo?.[0]?.roomId;

  const playerRef = useRef<YT.Player | null>(null);
  const lastSentStateRef = useRef<'playing' | 'paused' | null>(null);
  const isRemoteUpdateRef = useRef<boolean>(false);

  // 현재 재생 중인 영상
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<{
    id: string;
    start: number;
  } | null>(null);

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
    if (window.YT && id) {
      if (playerRef.current) {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById({
            videoId: id,
            startSeconds: startTime,
          });
        }
      } else {
        playerRef.current = new window.YT.Player('youtube-player', {
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
    const message = JSON.stringify({ roomId, playTime: time, playerState: state });
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
    if (event.data === window.YT.PlayerState.PLAYING) {
      if (lastSentStateRef.current !== 'playing') {
        broadcastPlayerState('playing', playTime);
      }
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      if (lastSentStateRef.current !== 'paused') {
        broadcastPlayerState('paused', playTime);
      }
    }
  };

  // 서버에서 play-time 메시지 수신 → 동기화
  useEffect(() => {
    if (!roomId) return;

    subTopic(
      `/topic/room/${roomId}/play-time`,
      (data: { playTime: number; playerState: string }) => {
        isRemoteUpdateRef.current = true;
        applySyncState(data);
      },
    );
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

  // // TODO: 10초마다 현재 재생 상태를 웹소켓으로 전송 (userList의 0번째 닉네임과 내 닉네임이 같을 경우)
  // const [playerReady, setPlayerReady] = useState(false);
  // const creatorName = currentRoom?.roomDetails?.userList[0]?.nickname;
  // useEffect(() => {
  //   if (!playerReady) return;
  //   if (!creatorName || creatorName !== currentRoom?.roomDetails?.userList[0]?.nickname) return; // 내 닉네임이 userList[0]의 닉네임과 같지 않으면 실행X

  //   const interval = setInterval(() => { // 10초마다 전송
  //     if (!playerRef.current) return;
  //     const playerState = playerRef.current.getPlayerState();
  //     const playTime = playerRef.current.getCurrentTime();

  //     if (playerState === window.YT.PlayerState.PLAYING) {
  //       broadcastPlayerState('playing', playTime);
  //     } else if (playerState === window.YT.PlayerState.PAUSED) {
  //       broadcastPlayerState('paused', playTime);
  //     }
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, [creatorName, currentRoom, playerReady]);

  // 영상 변경 시 플레이어 로드
  useEffect(() => {
    if (!videoQueue.length) return;

    const newCurrentVideo = videoQueue[0];

    // 현재 상태와 비교
    if (
      !currentPlayingVideo ||
      currentPlayingVideo.id !== newCurrentVideo.id ||
      currentPlayingVideo.start !== newCurrentVideo.start
    ) {
      loadPlayer(newCurrentVideo.id, newCurrentVideo.start);
      setCurrentPlayingVideo({
        id: newCurrentVideo.id,
        start: newCurrentVideo.start,
      });
    } else {
      // 동일 영상 id라면 재생 다시 시작 안 함
      console.log('같은 영상입니다');
    }
  }, [videoQueue, currentPlayingVideo]);

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
  overflow: hidden;
`;
