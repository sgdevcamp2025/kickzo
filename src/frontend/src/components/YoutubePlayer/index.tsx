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
  const previousIndexRef = useRef<number>(-1);

  // 유튜브 API 스크립트 동적 로드
  useEffect(() => {
    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }

    // window.onYouTubeIframeAPIReady = () => {
    //   console.log('YouTube API Ready');
    // };
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
      console.warn('⚠ client, roomId, pubTopic이 정의되지 않았습니다.');
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

    subTopic(`/topic/room/${roomId}/play-time`, (data: any) => {
      isRemoteUpdateRef.current = true;
      applySyncState(data);
    });
  }, [roomId, subTopic]);

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

    const isQueueSingle = videoQueue.length === 1;
    const isIndexChanged = currentIndex !== previousIndexRef.current;

    if (isQueueSingle || isIndexChanged) {
      loadPlayer(currentVideo.id, currentVideo.start);
      previousIndexRef.current = currentIndex;
    }
  }, [currentIndex, videoQueue]);

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

// import { useEffect, useRef } from 'react';
// import styled from 'styled-components';
// import { useVideoStore } from '@/stores/useVideoStore';
// import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
// import { useWebSocketStore } from '@/stores/useWebSocketStore';

// export const YouTubePlayer = () => {
//   const { videoQueue, currentIndex } = useVideoStore(); // ▶ 재생할 영상 정보
//   const { currentRoom } = useCurrentRoomStore(); // ▶ 현재 방 정보
//   const { client, subTopic } = useWebSocketStore(); // ▶ 웹소켓 클라이언트 및 구독 함수
//   const pubTopic = useWebSocketStore.getState().pubTopic; // ▶ 웹소켓 퍼블리시 함수
//   const roomId = currentRoom?.roomDetails.roomInfo[0]?.roomId;

//   const playerRef = useRef<YT.Player | null>(null); // ▶ 유튜브 플레이어
//   const lastSentStateRef = useRef<'playing' | 'paused' | null>(null); //  마지막으로 broadcast한 상태를 저장 (중복 전송 방지용)
//   const isRemoteUpdateRef = useRef<boolean>(false); //  원격 업데이트(다른 클라이언트에서 온 메시지) 플래그

//   // 유튜브 API 스크립트 동적 로드
//   useEffect(() => {
//     if (!document.getElementById('youtube-iframe-api')) {
//       const script = document.createElement('script');
//       script.id = 'youtube-iframe-api';
//       script.src = 'https://www.youtube.com/iframe_api';
//       document.body.appendChild(script);
//     }

//     window.onYouTubeIframeAPIReady = () => {
//       console.log('YouTube API Ready');
//     };
//   }, []);

//   // 유튜브 플레이어 로드
//   const loadPlayer = (id: string, startTime: number = 0) => {
//     if (window.YT && id) {
//       if (playerRef.current) {
//         if (typeof playerRef.current.loadVideoById === 'function') {
//           playerRef.current.loadVideoById({
//             videoId: id,
//             startSeconds: startTime,
//           });
//         }
//       } else {
//         playerRef.current = new window.YT.Player('youtube-player', {
//           height: '100%',
//           width: '100%',
//           videoId: id,
//           playerVars: { autoplay: 1, controls: 1, start: startTime },
//           events: {
//             onStateChange: handleVideoStateChange,
//             onReady: handlePlayerReady,
//           },
//         });
//       }
//     }
//   };

//   // 플레이어 준비 완료 시 실행
//   const handlePlayerReady = (event: YT.PlayerEvent) => {
//     playerRef.current = event.target;
//   };

//   // 유튜브 영상의 재생, 멈춤, 끝남 상태에 따라 동작
//   const broadcastPlayerState = (state: 'playing' | 'paused', time: number) => {
//     if (!client || !roomId || !pubTopic) {
//       console.warn('⚠ client, roomId, pubTopic이 정의되지 않았습니다.');
//       return;
//     }
//     lastSentStateRef.current = state; // broadcast 후 마지막 상태 업데이트
//     const message = { roomId, playTime: time, playerState: state };
//     pubTopic(`/app/play-time`, message);
//   };

//   // 내부 이벤트로 인한 상태 변화 감지
//   const handleVideoStateChange = (event: YT.OnStateChangeEvent) => {
//     if (isRemoteUpdateRef.current) {
//       isRemoteUpdateRef.current = false;
//       return;
//     }
//     if (!playerRef.current) return;
//     const playTime = playerRef.current.getCurrentTime();

//     if (event.data === YT.PlayerState.PLAYING) {
//       if (lastSentStateRef.current !== 'playing') {
//         broadcastPlayerState('playing', playTime);
//       }
//     } else if (event.data === YT.PlayerState.PAUSED) {
//       if (lastSentStateRef.current !== 'paused') {
//         broadcastPlayerState('paused', playTime);
//       }
//     }
//   };

//   // 서버에서 play-time 메시지 수신 → 동기화
//   useEffect(() => {
//     if (!roomId) return;

//     subTopic(`/topic/room/${roomId}/play-time`, (data: any) => {
//       isRemoteUpdateRef.current = true;
//       applySyncState(data);
//     });
//   }, [roomId, subTopic]);

//   // 서버에서 받은 동기화 적용
//   const applySyncState = ({ playTime, playerState }: { playTime: number; playerState: string }) => {
//     if (!playerRef.current) return;
//     playerRef.current.seekTo(playTime, true); // 시간 변경

//     // 재생/정지 상태 적용
//     if (playerState === 'playing') {
//       playerRef.current.playVideo();
//     } else if (playerState === 'paused') {
//       playerRef.current.pauseVideo();
//     }
//     lastSentStateRef.current = playerState as 'playing' | 'paused'; // 동기화 후 마지막 상태 업데이트
//   };

//   // 영상 변경 시 플레이어 로드
//   useEffect(() => {
//     if (videoQueue.length) {
//       loadPlayer(videoQueue[currentIndex].id, videoQueue[currentIndex].start);
//     }
//   }, [videoQueue[0]]);

//   // // 영상 변경 시 플레이어 로드
//   // useEffect(() => {
//   //   if (videoQueue.length > 0) {
//   //     loadPlayer(videoQueue[currentIndex].id, videoQueue[currentIndex].start);
//   //   }
//   // }, [videoQueue[0]]);
//   // // }, [currentIndex, videoQueue]);

//   return (
//     <Container>
//       <VideoWrapper>
//         <div id="youtube-player"></div>
//       </VideoWrapper>
//     </Container>
//   );
// };

// const Container = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;
// `;

// const VideoWrapper = styled.div`
//   width: 100%;
//   aspect-ratio: 16 / 9;
//   border-radius: 12px;
//   background-color: #000;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;
