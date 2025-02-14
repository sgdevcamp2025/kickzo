import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@/assets/img/AddCircle.svg';
import BellIcon from '@/assets/img/Bell.svg';
import {
  Wrapper,
  ButtonContainer,
  ButtonBox,
  LogoBox,
  LoginButton,
  ProfileButton,
} from './index.css';
import { LogoButton } from '@/components/common/LogoButton';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import { RoomCreateModal } from '@/components/Modal/RoomCreateModal';
import { NotificationModal } from '@/components/Modal/NotificationModal';
import { SearchBar } from '@/components/Search/SearchBar';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { ProfileModal } from '@/components/Modal/ProfileModal';
export const TopNavBar = () => {
  const { user, fetchMyProfile, clear } = useUserStore();
  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      fetchMyProfile();
    } else {
      clear();
    }
  }, [accessToken, fetchMyProfile, clear]);

  const clickNotification = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsNotificationModalOpen(true);
  };

  const handleCancelNotification = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsNotificationModalOpen(false);
  };

  const clickProfile = async () => {
    setIsProfileModalOpen(true);
  };

  const handleCancelProfile = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsProfileModalOpen(false);
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
          {user ? (
            <ProfileButton onClick={clickProfile}>
              <img src={user.profileImageUrl ?? DefaultProfile} alt="Profile" />
              {isProfileModalOpen && <ProfileModal onCancel={handleCancelProfile} />}
            </ProfileButton>
          ) : (
            <LoginButton>
              <Link to="/login">로그인</Link>
            </LoginButton>
          )}
        </ButtonContainer>
      </Wrapper>
      {isRoomCreateModalOpen && (
        <RoomCreateModal onCancel={() => setIsRoomCreateModalOpen(false)} />
      )}
    </>
  );
};
