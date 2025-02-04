import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';

import Trashcan from '@/assets/img/Trashcan.svg';
import ArrowUp from '@/assets/img/ArrowUp.svg';
import ArrowDown from '@/assets/img/ArrowDown.svg';

import {
  Container,
  Thumbnail,
  PreviewInfo,
  Playlist__Title,
  Playlist__Youtuber,
  ButtonContainer,
} from './index.css';

interface IPlaylistItem {
  video: {
    id: string;
    thumbnail: string;
    title: string;
    youtuber: string;
  };
  index: number;
  active: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (index: number) => void;
  onClick: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

export const PlaylistItem = (props: IPlaylistItem) => {
  return (
    <Container
      draggable
      onDragStart={() => props.onDragStart(props.index)}
      onDragOver={props.onDragOver}
      onDrop={() => props.onDrop(props.index)}
      onClick={() => props.onClick(props.index)}
      $active={props.active}
    >
      <Thumbnail src={props.video.thumbnail} alt={`Video ${props.video.id}`} />
      <PreviewInfo>
        <Playlist__Title>{props.video.title || '제목 없음'}</Playlist__Title>
        <Playlist__Youtuber>{props.video.youtuber || '유튜버 정보 없음'}</Playlist__Youtuber>
      </PreviewInfo>
      <ButtonContainer className="button-container">
        <div>
          <CommonButton
            onClick={e => {
              e.stopPropagation();
              props.onMoveUp(props.index);
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
              props.onMoveDown(props.index);
            }}
            color={ButtonColor.DARKGRAY}
            borderradius="100px"
            padding="5px"
          >
            <img src={ArrowDown} alt="Move Down" />
          </CommonButton>
        </div>
        <CommonButton
          onClick={e => {
            e.stopPropagation();
            props.onRemove(props.index);
          }}
          color={ButtonColor.DARKGRAY}
          borderradius="100px"
          padding="5px"
          height="24px"
        >
          <img src={Trashcan} alt="Remove" />
        </CommonButton>
      </ButtonContainer>
    </Container>
  );
};
