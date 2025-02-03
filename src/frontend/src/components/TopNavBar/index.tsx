import { Link } from 'react-router-dom';
import AddCircleIcon from '@/assets/img/AddCircle.svg';
import BellIcon from '@/assets/img/Bell.svg';
import { Wrapper, ButtonContainer, ButtonBox, LogoBox, LoginButton } from './index.css';
import { LogoButton } from '@/components/common/LogoButton';
import { RoomDeleteModal } from '@/components/Modal/RoomDeleteModal';
import { useState } from 'react';

export const TopNavBar = () => {
  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false);

  return (
    <>
      <Wrapper>
        <LogoBox>
          <LogoButton />
        </LogoBox>
        <div>검색바</div>
        <ButtonContainer>
          <ButtonBox onClick={() => setIsRoomCreateModalOpen(true)}>
            <img src={AddCircleIcon} alt="Create Room" />
          </ButtonBox>
          <ButtonBox>
            <img src={BellIcon} alt="Notification" />
          </ButtonBox>
          <LoginButton>
            <Link to="/login">로그인</Link>
          </LoginButton>
        </ButtonContainer>
      </Wrapper>
      {isRoomCreateModalOpen && (
        <RoomDeleteModal onCancel={() => setIsRoomCreateModalOpen(false)} />
      )}
    </>
  );
};
