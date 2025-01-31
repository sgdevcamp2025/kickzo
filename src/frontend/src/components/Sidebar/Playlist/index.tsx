import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CommonButton } from '@/components/common/Button';
import { useVideoStore } from '@/stores/useVideoStore';

import {
  Container,
  Wrapper,
  InputContainer,
  SearchInput,
  PreviewContainer,
  PreviewImg,
  PreviewInfo,
  PreviewInfo__Title,
  PreviewInfo__Youtuber,
  Overlay,
} from './index.css';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { useDebounce } from '@/hooks/useDebounce';
import { PlaylistItem } from './PlaylistItem';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const Playlist = () => {
  const [inputUrl, setInputUrl] = useState<string>(''); // input창에 사용자가 입력한 URL
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(''); // Input창에 사용자가 URL을 입력했을때 미리보기 위한 썸네일
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null); // 플레이리스트 요소에 대해 드래그중인 index
  const [videoTitle, setVideoTitle] = useState<string>(''); // 입력한 URL에 대한 영상의 제목
  const [videoYoutuber, setVideoYoutuber] = useState<string>(''); // 입력한 URL에 대한 영상의 유튜버
  const debouncedInputUrl = useDebounce(inputUrl, 1000); // input창에 입력중인 URL에 대해서 디바운스

  const {
    videoQueue,
    currentIndex,
    addVideo,
    removeVideo,
    moveVideoUp,
    moveVideoDown,
    setCurrentIndex,
  } = useVideoStore();

  // 사용자가 입력한 URL로부터 영상의 ID와 시간을 받아온다.
  const extractVideoIdAndStartTime = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)(?:.*[?&]t=(\d+))?/;
    const match = url.match(regex);
    return {
      videoId: match ? match[1] : '',
      startTime: match && match[2] ? parseInt(match[2], 10) : 0,
    };
  };

  // 디바운스된 URL이 바뀔때마다
  useEffect(() => {
    const fetchVideoDetails = async (videoId: string) => {
      try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'snippet',
            id: videoId,
            key: API_KEY,
            hl: 'ko',
          },
        });
        const data = response.data;
        if (data.items && data.items.length > 0) {
          const { title, channelTitle } = data.items[0].snippet;
          setVideoTitle(title);
          setVideoYoutuber(channelTitle);
        } else {
          setVideoTitle('');
          setVideoYoutuber('');
        }
      } catch (error) {
        console.error('Failed to fetch video details:', error);
        setVideoTitle('');
        setVideoYoutuber('');
      }
    };

    if (debouncedInputUrl) {
      const { videoId } = extractVideoIdAndStartTime(debouncedInputUrl);
      if (videoId) {
        setThumbnailPreview(`https://img.youtube.com/vi/${videoId}/0.jpg`);
        fetchVideoDetails(videoId);
      } else {
        setThumbnailPreview('');
        setVideoTitle('');
        setVideoYoutuber('');
      }
    }
  }, [debouncedInputUrl]);

  const handleAddVideo = () => {
    const { videoId, startTime } = extractVideoIdAndStartTime(inputUrl);
    if (!videoId) {
      alert('유효한 유튜브 URL을 입력하세요!');
      return;
    }

    addVideo({
      id: videoId,
      start: startTime,
      thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
      title: videoTitle,
      youtuber: videoYoutuber,
    });

    setInputUrl('');
    setThumbnailPreview('');
    setVideoTitle('');
    setVideoYoutuber('');
  };
  // const handleAddVideo = () => {
  //   const { videoId, startTime } = extractVideoIdAndStartTime(inputUrl);
  //   if (!videoId) {
  //     alert('유효한 유튜브 URL을 입력하세요!');
  //     return;
  //   }

  //   props.setVideoQueue(prevQueue => [
  //     ...prevQueue,
  //     {
  //       id: videoId,
  //       start: startTime,
  //       thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`, // NOTE - 유튜브 썸네일
  //       title: videoTitle,
  //       youtuber: videoYoutuber,
  //     },
  //   ]);
  //   setInputUrl('');
  //   setThumbnailPreview('');
  //   setVideoTitle('');
  //   setVideoYoutuber('');
  // };

  // const handleRemove = (index: number) => {
  //   props.setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
  //   if (props.currentIndex === index) {
  //     props.setCurrentIndex(0);
  //   } else if (props.currentIndex > index) {
  //     props.setCurrentIndex(props.currentIndex - 1);
  //   }
  // };

  // const handleMoveUp = (index: number) => {
  //   if (index === 0) return;

  //   const newQueue = [...props.videoQueue];
  //   const temp = newQueue[index];
  //   newQueue[index] = newQueue[index - 1];
  //   newQueue[index - 1] = temp;

  //   props.setVideoQueue(newQueue);

  //   if (props.currentIndex === index) {
  //     props.setCurrentIndex(index - 1);
  //   } else if (props.currentIndex === index - 1) {
  //     props.setCurrentIndex(index);
  //   }
  // };

  // const handleMoveDown = (index: number) => {
  //   if (index === props.videoQueue.length - 1) return;

  //   const newQueue = [...props.videoQueue];
  //   const temp = newQueue[index];
  //   newQueue[index] = newQueue[index + 1];
  //   newQueue[index + 1] = temp;

  //   props.setVideoQueue(newQueue);

  //   if (props.currentIndex === index) {
  //     props.setCurrentIndex(index + 1);
  //   } else if (props.currentIndex === index + 1) {
  //     props.setCurrentIndex(index);
  //   }
  // };

  // const handleDragStart = (index: number) => {
  //   setDraggedIndex(index);
  // };

  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  // };

  // const handleDrop = (index: number) => {
  //   if (draggedIndex === null || draggedIndex === index) return;

  //   const updatedQueue = [...videoQueue];
  //   const [draggedItem] = updatedQueue.splice(draggedIndex, 1);
  //   updatedQueue.splice(index, 0, draggedItem);

  //   // setVideoQueue(updatedQueue);
  //   useVideoStore.setState({ videoQueue: updatedQueue });

  //   setDraggedIndex(null);
  // };

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (index: number) => {
      if (draggedIndex === null || draggedIndex === index) return;

      const updatedQueue = [...videoQueue];
      const [draggedItem] = updatedQueue.splice(draggedIndex, 1);
      updatedQueue.splice(index, 0, draggedItem);

      useVideoStore.setState({ videoQueue: updatedQueue });

      setDraggedIndex(null);
    },
    [draggedIndex, videoQueue],
  );

  return (
    <Container>
      <Wrapper>
        {videoQueue.map((video, index) => (
          <PlaylistItem
            key={video.id}
            video={video}
            index={index}
            active={index === currentIndex}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e)}
            onDrop={() => handleDrop(index)}
            onClick={() => setCurrentIndex(index)}
            onMoveUp={() => moveVideoUp(index)}
            onMoveDown={() => moveVideoDown(index)}
            onRemove={() => removeVideo(index)}
          />
        ))}
      </Wrapper>
      <div>
        {videoTitle && (
          <PreviewContainer>
            <Overlay className="overlay" onClick={handleAddVideo}>
              추가하기
            </Overlay>
            <CommonButton onClick={handleAddVideo} color={ButtonColor.DARKGRAY} padding="10px">
              <PreviewImg src={thumbnailPreview} />
              <PreviewInfo>
                <PreviewInfo__Title>{videoTitle || '제목 없음'}</PreviewInfo__Title>
                <PreviewInfo__Youtuber>{videoYoutuber || '유튜버 정보 없음'}</PreviewInfo__Youtuber>
              </PreviewInfo>
            </CommonButton>
          </PreviewContainer>
        )}
        <InputContainer>
          <SearchInput
            type="text"
            placeholder="URL을 입력하세요"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
          />
        </InputContainer>
      </div>
    </Container>
  );
};
