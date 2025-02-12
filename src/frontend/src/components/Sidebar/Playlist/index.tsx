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
import { useDebounce } from '@/hooks/utils/useDebounce';
import { PlaylistItem } from './PlaylistItem';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;

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

export const Playlist = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoYoutuber, setVideoYoutuber] = useState('');
  const debouncedInputUrl = useDebounce(inputUrl, 1000);
  const {
    videoQueue,
    currentIndex,
    addVideo,
    removeVideo,
    moveVideoUp,
    moveVideoDown,
    setCurrentVideo,
    setCurrentIndex,
  } = useVideoStore();

  const ChangeToWebSocketType = () => {
    const { videoQueue } = useVideoStore.getState();
    const formattedQueue = videoQueue.map((video, index) => ({
      order: index,
      url: `https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}` : ''}`,
    }));
    // TODO: 추후 WebSocket 타입으로 변경할 때 사용
    console.log('playlist: ' + JSON.stringify(formattedQueue));
  };

  useEffect(() => {
    const fetchVideoDetails = async (videoId: string) => {
      try {
        const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'snippet',
            id: videoId,
            key: API_KEY,
            hl: 'ko',
          },
        });
        const items = data.items;
        if (items && items.length > 0) {
          const { title, channelTitle } = items[0].snippet;
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

    ChangeToWebSocketType();

    setInputUrl('');
    setThumbnailPreview('');
    setVideoTitle('');
    setVideoYoutuber('');
  };

  const handleRemoveVideo = (index: number) => {
    removeVideo(index);
    ChangeToWebSocketType();
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (dropIndex: number) => {
      if (draggedIndex === null || draggedIndex === dropIndex) return;

      useVideoStore.setState(state => {
        const updatedQueue = [...state.videoQueue];
        const [draggedItem] = updatedQueue.splice(draggedIndex, 1);
        updatedQueue.splice(dropIndex, 0, draggedItem);

        let newCurrentIndex = state.currentIndex;
        if (draggedIndex === state.currentIndex) {
          newCurrentIndex = dropIndex;
        } else if (draggedIndex < state.currentIndex && state.currentIndex <= dropIndex) {
          newCurrentIndex = state.currentIndex - 1;
        } else if (dropIndex <= state.currentIndex && state.currentIndex < draggedIndex) {
          newCurrentIndex = state.currentIndex + 1;
        }

        ChangeToWebSocketType();

        return { videoQueue: updatedQueue, currentIndex: newCurrentIndex };
      });
      setDraggedIndex(null);
    },
    [draggedIndex],
  );

  const handleSetCurrentVideo = (index: number) => {
    setCurrentVideo(index);
    setCurrentIndex(index);
    ChangeToWebSocketType();
  };

  return (
    <Container>
      <Wrapper>
        {videoQueue.map((video, index) =>
          index > 0 ? (
            <PlaylistItem
              key={`${video.id}-${index}`}
              video={video}
              index={index}
              active={index === currentIndex}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onClick={() => handleSetCurrentVideo(index)}
              onMoveUp={() => moveVideoUp(index)}
              onMoveDown={() => moveVideoDown(index)}
              onRemove={() => handleRemoveVideo(index)}
            />
          ) : null,
        )}
      </Wrapper>
      <div>
        {videoTitle && (
          <PreviewContainer>
            <Overlay onClick={handleAddVideo}>추가하기</Overlay>
            <CommonButton
              onClick={handleAddVideo}
              color={ButtonColor.DARKGRAY}
              padding="10px"
              width="100%"
              justifycontent="flex-start"
            >
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
