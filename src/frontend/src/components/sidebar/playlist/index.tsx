import { useState } from 'react';
import Trashcan from '@/assets/img/Trashcan.svg';
import ArrowUp from '@/assets/img/ArrowUp.svg';
import ArrowDown from '@/assets/img/ArrowDown.svg';
import { CommonButton } from '@/components/common/button';
import { Container, Wrapper, VideoItem, Thumbnail, InputContainer, SearchInput } from './index.css';
import { ButtonColor } from '@/types/enums/ButtonColor';

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
      <InputContainer>
        <SearchInput
          type="text"
          placeholder="URL을 입력하세요"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
        />
        <CommonButton color={ButtonColor.DARKGRAY} onClick={handleAddVideo} padding="5px 10px">
          +
        </CommonButton>
      </InputContainer>
    </Container>
  );
};
