import { useEffect, useState } from 'react';
import axios from 'axios';
import Trashcan from '@/assets/img/Trashcan.svg';
import ArrowUp from '@/assets/img/ArrowUp.svg';
import ArrowDown from '@/assets/img/ArrowDown.svg';
import { CommonButton } from '@/components/Common/Button';

import {
  Container,
  Wrapper,
  VideoItem,
  Thumbnail,
  InputContainer,
  SearchInput,
  PreviewContainer,
  PreviewImg,
  PreviewInfo,
  PreviewInfo__Title,
  PreviewInfo__Youtuber,
  Playlist__Title,
  Playlist__Youtuber,
  Overlay,
} from './index.css';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { useDebounce } from '@/hooks/useDebounce';

interface VideoItem {
  id: string;
  start: number;
  thumbnail: string;
  title: string;
  youtuber: string;
}

interface IPlaylist {
  videoQueue: VideoItem[];
  setVideoQueue: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

// const API_KEY = 'AIzaSyDK12psipbT4AjPHNhDDr1WPN_3owoZn_M';
const API_KEY = 'AIzaSyDK12psipbT4AjPHNhDDr1WPN_3owoZn_M';

export const Playlist = (props: IPlaylist) => {
  const [inputUrl, setInputUrl] = useState<string>(''); // input창에 사용자가 입력한 URL
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(''); // Input창에 사용자가 URL을 입력했을때 미리보기 위한 썸네일
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null); // 플레이리스트 요소에 대해 드래그중인 index
  const [videoTitle, setVideoTitle] = useState<string>(''); // 입력한 URL에 대한 영상의 제목
  const [videoYoutuber, setVideoYoutuber] = useState<string>(''); // 입력한 URL에 대한 영상의 유튜버
  const debouncedInputUrl = useDebounce(inputUrl, 1000); // input창에 입력중인 URL에 대해서 디바운스

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

    props.setVideoQueue(prevQueue => [
      ...prevQueue,
      {
        id: videoId,
        start: startTime,
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`, // NOTE - 유튜브 썸네일
        title: videoTitle,
        youtuber: videoYoutuber,
      },
    ]);
    setInputUrl('');
    setThumbnailPreview('');
    setVideoTitle('');
    setVideoYoutuber('');
  };

  const handleRemove = (index: number) => {
    props.setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
    if (props.currentIndex === index) {
      props.setCurrentIndex(0);
    } else if (props.currentIndex > index) {
      props.setCurrentIndex(props.currentIndex - 1);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newQueue = [...props.videoQueue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index - 1];
    newQueue[index - 1] = temp;

    props.setVideoQueue(newQueue);

    if (props.currentIndex === index) {
      props.setCurrentIndex(index - 1);
    } else if (props.currentIndex === index - 1) {
      props.setCurrentIndex(index);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === props.videoQueue.length - 1) return;

    const newQueue = [...props.videoQueue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index + 1];
    newQueue[index + 1] = temp;

    props.setVideoQueue(newQueue);

    if (props.currentIndex === index) {
      props.setCurrentIndex(index + 1);
    } else if (props.currentIndex === index + 1) {
      props.setCurrentIndex(index);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedQueue = [...props.videoQueue];
    const [draggedItem] = updatedQueue.splice(draggedIndex, 1);
    updatedQueue.splice(index, 0, draggedItem);

    props.setVideoQueue(updatedQueue);
    setDraggedIndex(null);
  };

  return (
    <Container>
      <Wrapper>
        {props.videoQueue.map((video, index) => (
          <VideoItem
            key={`${video.id}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onClick={() => props.setCurrentIndex(index)}
            active={index === props.currentIndex}
          >
            <Thumbnail src={video.thumbnail} alt={`Video ${video.id}`} />
            <PreviewInfo>
              <Playlist__Title>{video.title || '제목 없음'}</Playlist__Title>
              <Playlist__Youtuber>{video.youtuber || '유튜버 정보 없음'}</Playlist__Youtuber>
            </PreviewInfo>
            <div>
              <CommonButton
                onClick={e => {
                  e.stopPropagation();
                  handleMoveUp(index);
                }}
                color={ButtonColor.DARKGRAY}
                borderradius="100px"
                padding="5px"
              >
                <img src={ArrowUp} alt="Move Up" />
              </CommonButton>
              <CommonButton
                onClick={e => {
                  e.stopPropagation();
                  handleMoveDown(index);
                }}
                color={ButtonColor.DARKGRAY}
                borderradius="100px"
                padding="5px"
              >
                <img src={ArrowDown} alt="Move Down" />
              </CommonButton>
              <CommonButton
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                color={ButtonColor.DARKGRAY}
                borderradius="100px"
                padding="5px"
              >
                <img src={Trashcan} alt="Remove" />
              </CommonButton>
            </div>
          </VideoItem>
        ))}
      </Wrapper>
      <div>
        {videoTitle && (
          <PreviewContainer>
            <Overlay className="overlay" onClick={handleAddVideo}>
              추가하기
            </Overlay>
            <CommonButton onClick={handleAddVideo} color={ButtonColor.SEMIBLACK} padding="10px">
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
