import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useVideoStore } from '@/stores/useVideoStore';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer = () => {
  // const [videoQueue, setVideoQueue] = useState<VideoItem[]>([]); // 재생 목록
  // const [currentIndex,  setCurrentIndex] = useState<number>(0); // 현재 재생 중인 비디오의 인덱스
  // const [inputUrl, setInputUrl] = useState<string>(''); // 사용자가 입력한 유튜브 URL
  // const [seekTime, setSeekTime] = useState<string>(''); // 사용자가 입력한 이동 시간

  const { videoQueue, currentIndex, setCurrentIndex } = useVideoStore();

  const playerRef = useRef<YT.Player | null>(null); // 유튜브 플레이어 객체
  const lastKnownTimeRef = useRef<number>(0); // 마지막으로 기록된 재생 시간

  // 유튜브 API 스크립트 동적 로드
  useEffect(() => {
    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
    };
  }, []);

  // //  유튜브 URL에서 videoId 및 startTime(시작 시간) 추출
  // const extractVideoIdAndStartTime = (url: string): { videoId: string; startTime: number } => {
  //   const regex =
  //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)(?:.*[?&]t=(\d+))?/;
  //   const match = url.match(regex);

  //   return {
  //     videoId: match ? match[1] : '',
  //     startTime: match && match[2] ? parseInt(match[2], 10) : 0,
  //   };
  // };

  // // 재생 목록에 추가
  // const handleAddVideo = () => {
  //   const { videoId, startTime } = extractVideoIdAndStartTime(inputUrl);
  //   if (!videoId) {
  //     alert('유효한 유튜브 URL을 입력하세요!');
  //     return;
  //   }

  //    setVideoQueue(prevQueue => [
  //     ...prevQueue,
  //     {
  //       id: videoId,
  //       start: startTime,
  //       thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
  //     },
  //   ]);
  //   setInputUrl('');
  // };

  // 유튜브 플레이어 로드
  const loadPlayer = (id: string, startTime: number = 0) => {
    if (window.YT && id) {
      if (playerRef.current) {
        playerRef.current.loadVideoById({
          videoId: id,
          startSeconds: startTime,
        });
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

    lastKnownTimeRef.current = playerRef.current.getCurrentTime(); // 현재 재생 시간 저장

    // 1000ms마다 현재 시간이 맞는지 확인하다가 시간이 다르다면 바뀐 시간을 console.log로 찍어줌
    // TODO - 매초마다 확인하는 방법이 맞는지 확인하기
    setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (Math.abs(currentTime - lastKnownTimeRef.current) > 1.5) {
          console.log(`사용자가 시간을 변경했습니다: ${Math.floor(currentTime)}초`);
        }
        lastKnownTimeRef.current = currentTime; // 변경된 시간을 최신값으로 업데이트
      }
    }, 1000);
  };

  // 유튜브 영상의 재생, 멈춤, 끝남 상태에 따라 동작
  // TODO - 재생시, 끝남시, 다음 영상 재생시 소켓에 보내줌
  const handleVideoStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING) {
      console.log('재생');
    } else if (event.data === YT.PlayerState.PAUSED) {
      console.log('멈춤');
    } else if (event.data === YT.PlayerState.ENDED) {
      handleNextVideo();
    }
  };

  // 재생할 영상의 index가 바뀌거나
  // video목록에 영상이 추가되었는데 이게 유일한 영상이라 바로 재생해야한다면,
  // 유튜브 영상을 재생한다
  useEffect(() => {
    if (videoQueue.length > 0) {
      loadPlayer(videoQueue[currentIndex].id, videoQueue[currentIndex].start);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (videoQueue.length === 1) {
      loadPlayer(videoQueue[currentIndex].id, videoQueue[currentIndex].start);
    }
  }, [videoQueue]);

  // //   이전 영상 재생
  // const handlePrevVideo = () => {
  //   if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  // };

  //   다음 영상 재생
  // const handleNextVideo = () => {
  //   if (currentIndex < videoQueue.length - 1) setCurrentIndex(prev => prev + 1);
  // };

  // // input창에 숫자를 입력하면 해당 초로 이동
  // // TODO - 나중에 싱크 맞출때 소켓으로 시간 받아오면 해당 시간으로 유튜브 영상 변경
  // const handleSeek = () => {
  //   if (playerRef.current) {
  //     const time = parseInt(seekTime, 10);
  //     const duration = playerRef.current.getDuration();

  //     if (!isNaN(time) && time >= 0 && time <= duration) {
  //       playerRef.current.seekTo(time, true);
  //       console.log(`입력에 의해 ${time}초로 이동`);
  //     } else {
  //       alert(`0 ~ ${Math.floor(duration)}초 사이의 값을 입력하세요.`);
  //     }
  //   }
  // };

  return (
    <Container>
      <VideoWrapper className="clickclick2">
        <div id="youtube-player"></div>
      </VideoWrapper>
      {/* <SeekContainer>
        <Input
          type="number"
          placeholder="이동할 시간 (초)"
          value={seekTime}
          onChange={(e) => setSeekTime(e.target.value)}
        />
        <Button onClick={handleSeek}>이동</Button>
      </SeekContainer>
      {videoQueue.length > 0 && (
        <ButtonGroup>
          <Button onClick={handlePrevVideo} disabled={currentIndex === 0}>
            ◀ 이전
          </Button>
          <Button
            onClick={handleNextVideo}
            disabled={currentIndex === videoQueue.length - 1}
          >
            다음 ▶
          </Button>
        </ButtonGroup>
      )} */}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
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

// interface VideoItemCSS {
//   $active?: boolean;
// }

// const VideoItem = styled.div<VideoItemCSS>`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   cursor: pointer;
//   padding: 10px;
//   border-radius: 5px;
//   background-color: ${({ $active }) => ($active ? '#f8d7da' : '#fff')};
//   border: ${({ $active }) => ($active ? '2px solid #ff0000' : '1px solid #ddd')};
// `;
