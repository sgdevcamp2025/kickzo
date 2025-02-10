import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@/assets/img/AddCircle.svg';
import BellIcon from '@/assets/img/Bell.svg';
import { Wrapper, ButtonContainer, ButtonBox, LogoBox, LoginButton } from './index.css';
import { LogoButton } from '@/components/common/LogoButton';
import { RoomCreateModal } from '@/components/Modal/RoomCreateModal';
import { NotificationModal } from '@/components/Modal/NotificationModal';
import { SearchBar } from '@/components/Search/SearchBar';
import { authApi } from '@/api/endpoints/auth/auth.api';
import { userApi } from '@/api/endpoints/user/user.api';

export const TopNavBar = () => {
  const navigate = useNavigate();

  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const clickNotification = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsNotificationModalOpen(true);
  };

  const handleCancelNotification = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsNotificationModalOpen(false);
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/');
  };

  const handleProfile = async () => {
    const profile = await userApi.getProfile();
    console.log(profile);
  };

  return (
    <>
      <Wrapper>
        <LogoBox>
          <LogoButton />
        </LogoBox>
        <SearchBar />
        <ButtonContainer>
          <ButtonBox onClick={() => setIsRoomCreateModalOpen(true)}>
            <img src={AddCircleIcon} alt="Create Room" />
          </ButtonBox>
          <ButtonBox onClick={clickNotification}>
            <img src={BellIcon} alt="Notification" />
            {isNotificationModalOpen && <NotificationModal onCancel={handleCancelNotification} />}
          </ButtonBox>
          <LoginButton>
            <Link to="/login">로그인</Link>
          </LoginButton>
          <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
          <LoginButton onClick={handleProfile}>프로필</LoginButton>
        </ButtonContainer>
      </Wrapper>
      {isRoomCreateModalOpen && (
        <RoomCreateModal onCancel={() => setIsRoomCreateModalOpen(false)} />
      )}
    </>
  );
};
