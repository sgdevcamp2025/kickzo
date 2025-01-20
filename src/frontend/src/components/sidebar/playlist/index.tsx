import { useState } from 'react';
import Trashcan from '@/assets/img/Trashcan.svg';
import { Button } from '@/components/common/button';
import {
  PlaylistContainer,
  PlaylistWrapper,
  VideoItem,
  Thumbnail,
  InputContainer,
  SearchInput,
} from './index.css';

enum ButtonColor {
  LIGHTGRAY = '#f4f4f4',
  GRAY = '#d4d4d4',
  DARKGRAY = '#444444',
  ORANGE = '#FF9100',
  TRANSPARENT = 'transparent',
}

interface VideoItem {
  id: string;
  start: number;
  thumbnail: string;
}

interface IPlaylist {
  videoQueue: VideoItem[];
  setVideoQueue: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Playlist = (props: IPlaylist) => {
  const [inputUrl, setInputUrl] = useState<string>('');

  const extractVideoIdAndStartTime = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)(?:.*[?&]t=(\d+))?/;
    const match = url.match(regex);
    return {
      videoId: match ? match[1] : '',
      startTime: match && match[2] ? parseInt(match[2], 10) : 0,
    };
  };

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
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
      },
    ]);
    setInputUrl('');
  };

  const handleVideoStart = (index: number) => {
    props.setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index));

    if (props.currentIndex === index) {
      props.setCurrentIndex(0);
    } else if (props.currentIndex > index) {
      props.setCurrentIndex(props.currentIndex - 1);
    }
  };

  const handleRemove = (index: number) => {
    props.setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index));

    if (props.currentIndex === index) {
      props.setCurrentIndex(0);
    } else if (props.currentIndex > index) {
      props.setCurrentIndex(props.currentIndex - 1);
    }
  };

  return (
    <PlaylistContainer>
      <PlaylistWrapper>
        {props.videoQueue.map((video, index) => (
          <VideoItem
            key={`${video.id}-${index}`}
            onClick={() => props.setCurrentIndex(index)}
            $active={index === props.currentIndex}
          >
            <Thumbnail src={video.thumbnail} alt={`Video ${video.id}`} />
            <Button
              onClick={e => {
                e.stopPropagation();
                handleRemove(index);
              }}
              color={ButtonColor.DARKGRAY}
              borderRadius="100px"
              padding="5px"
            >
              <img src={Trashcan} />
            </Button>
          </VideoItem>
        ))}
      </PlaylistWrapper>
      <InputContainer>
        <SearchInput
          type="text"
          placeholder="url을 넣어주세요"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
        />
        <Button color={ButtonColor.DARKGRAY} onClick={handleAddVideo} padding="5px 10px">
          +
        </Button>
      </InputContainer>
    </PlaylistContainer>
  );
};
