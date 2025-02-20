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
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { useUserStore } from '@/stores/useUserStore';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
import { roomApi } from '@/api/endpoints/room/room.api';

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
  const debouncedInputUrl = useDebounce(inputUrl, 500);

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
  const { currentRoom } = useCurrentRoomStore();
  const roomId = currentRoom?.roomDetails.roomInfo[0]?.roomId;

  const { subTopic } = useWebSocketStore();

  const updatePlaylistOnServer = async () => {
    const { videoQueue } = useVideoStore.getState();
    const userId = useUserStore.getState().user?.userId;

    if (!userId) {
      console.error('사용자 ID가 없습니다.');
      return;
    }

    const requestData = videoQueue.map((video, index) => ({
      order: index,
      url: `https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}` : ''}`,
      title: video.title,
      youtuber: video.youtuber,
    }));

    try {
      const response = await roomApi.sendPlaylist(roomId!, requestData);
      console.log('플레이리스트 업데이트 성공:', response);
    } catch (error) {
      console.error('플레이리스트 업데이트 실패:', error);
    }
  };

  // debouncedInputUrl이 변경되면 YouTube API를 통해 영상 정보를 가져온다
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

    updatePlaylistOnServer();

    setInputUrl('');
    setThumbnailPreview('');
    setVideoTitle('');
    setVideoYoutuber('');
  };

  const handleRemoveVideo = (index: number) => {
    removeVideo(index);
    updatePlaylistOnServer();
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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

        updatePlaylistOnServer();

        return { videoQueue: updatedQueue, currentIndex: newCurrentIndex };
      });
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex],
  );

  const handleSetCurrentVideo = (index: number) => {
    setCurrentVideo(index);
    setCurrentIndex(index);
    updatePlaylistOnServer();
  };

  const getReorderedVideos = useCallback(() => {
    if (draggedIndex === null || dragOverIndex === null) return videoQueue;

    const reorderedVideos = [...videoQueue];
    const [draggedVideo] = reorderedVideos.splice(draggedIndex, 1);
    reorderedVideos.splice(dragOverIndex, 0, draggedVideo);
    return reorderedVideos;
  }, [videoQueue, draggedIndex, dragOverIndex]);

  useEffect(() => {
    if (!roomId) {
      console.warn('roomId가 없습니다. 구독 취소됨');
      return;
    }

    subTopic(`/topic/room/${roomId}/playlist-update`, (data: any) => {
      if (data?.playlist && Array.isArray(data.playlist)) {
        (async () => {
          // order 기준으로 정렬한 후 각 항목을 변환
          const sortedPlaylist = data.playlist.sort((a: any, b: any) => a.order - b.order);
          const updatedQueue = await Promise.all(
            sortedPlaylist.map(async (item: any) => {
              const { videoId, startTime } = extractVideoIdAndStartTime(item.url);
              let title = item.title;
              let youtuber = item.youtuber;
              if (!title || !youtuber) {
                try {
                  const { data: apiData } = await axios.get(
                    'https://www.googleapis.com/youtube/v3/videos',
                    {
                      params: {
                        part: 'snippet',
                        id: videoId,
                        key: API_KEY,
                        hl: 'ko',
                      },
                    },
                  );
                  const items = apiData.items;
                  if (items && items.length > 0) {
                    title = title || items[0].snippet.title;
                    youtuber = youtuber || items[0].snippet.channelTitle;
                  } else {
                    title = title || '제목 없음';
                    youtuber = youtuber || '유튜버 정보 없음';
                  }
                } catch (error) {
                  console.error('Error fetching video details for URL:', item.url, error);
                  title = title || '제목 없음';
                  youtuber = youtuber || '유튜버 정보 없음';
                }
              }
              return {
                id: videoId,
                start: startTime,
                thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
                title,
                youtuber,
              };
            }),
          );
          useVideoStore.setState({ videoQueue: updatedQueue });
        })();
      } else {
        console.warn('잘못된 웹소켓 데이터 수신:', data);
      }
    });
  }, [roomId, subTopic]);

  return (
    <Container>
      <Wrapper>
        {getReorderedVideos().map((video, index) =>
          index > 0 ? (
            <PlaylistItem
              key={`${video.id}-${index}`}
              video={video}
              index={index}
              active={index === currentIndex}
              isDragging={index === draggedIndex}
              isPreview={draggedIndex !== null && index === dragOverIndex}
              onClick={() => handleSetCurrentVideo(index)}
              onMoveUp={() => moveVideoUp(index)}
              onMoveDown={() => moveVideoDown(index)}
              onRemove={() => handleRemoveVideo(index)}
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={() => handleDrop(index)}
            />
          ) : null,
        )}
      </Wrapper>
      <div>
        {videoTitle && (
          <PreviewContainer>
            <Overlay onClick={handleAddVideo}>추가하기</Overlay>
            <CommonButton
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
