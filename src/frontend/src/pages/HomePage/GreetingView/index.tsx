import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';
import ViewVideo from '@/assets/img/ViewVideo.svg';
import {
  GreetingViewContainer,
  GreetingViewImage,
  GreetingViewSubTitle,
  GreetingViewTitle,
  GreetingViewWrapper,
} from '@/ui/Common.css';
import { useState } from 'react';
import { RoomCreateModal } from '@/components/Modal/RoomCreateModal';

export const GreetingView = () => {
  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false);

  const handleCreateRoom = () => {
    setIsRoomCreateModalOpen(true);
  };

  return (
    <>
      <GreetingViewWrapper>
        <GreetingViewContainer>
          <GreetingViewImage>
            <img src={ViewVideo} alt="greeting-view-image" />
          </GreetingViewImage>
          <GreetingViewTitle>실시간 비디오 채팅을 시작해보세요</GreetingViewTitle>
          <GreetingViewSubTitle>
            지금 바로 새로운 방을 만들어 대화를 시작해보세요.
          </GreetingViewSubTitle>
          <CommonButton
            color={ButtonColor.BLACK}
            borderradius="10px"
            padding="0 3rem"
            height="3rem"
            onClick={handleCreateRoom}
          >
            방 만들기
          </CommonButton>
        </GreetingViewContainer>
      </GreetingViewWrapper>
      {isRoomCreateModalOpen && (
        <RoomCreateModal onCancel={() => setIsRoomCreateModalOpen(false)} />
      )}
    </>
  );
};
