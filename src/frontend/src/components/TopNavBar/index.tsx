import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import AddCircleIcon from '@/assets/img/AddCircle.svg';
import BellIcon from '@/assets/img/Bell.svg';
import {
  Wrapper,
  ButtonContainer,
  ButtonBox,
  LogoBox,
  LoginButton,
  ProfileButton,
  NotificationCount,
} from './index.css';
import { LogoButton } from '@/components/common/LogoButton';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import { RoomCreateModal } from '@/components/Modal/RoomCreateModal';
import { NotificationModal } from '@/components/Modal/NotificationModal';
import { SearchBar } from '@/components/Search/SearchBar';
import { ProfileModal } from '@/components/Modal/MyProfileModal';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';
import { useWebSocketStore } from '@/stores/useWebSocketStore';

import { friendApi } from '@/api/endpoints/friend/friend.api';
import { useFriendStore } from '@/stores/useFriendStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export const TopNavBar = () => {
  const navigate = useNavigate();
  const { user, fetchMyProfile, clearProfile } = useUserStore();
  const { fetchMyRooms } = useMyRoomsStore();
  const { fetchFriends } = useFriendStore();
  const {
    newNotificationCount,
    increaseNotificationCount,
    resetNotificationCount,
    fetchNotifications,
  } = useNotificationStore();
  const { connect } = useWebSocketStore();
  const accessToken = useAuthStore(state => state.accessToken);

  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    connect();

    if (!accessToken) {
      clearProfile();
      return;
    }

    const initializeUser = async () => {
      try {
        await fetchMyProfile();
        const [_rooms, _friends, _notifications, unreadData] = await Promise.all([
          fetchMyRooms(),
          fetchFriends(),
          fetchNotifications(),
          friendApi.getUnreadNotificationsCount(),
        ]);
        increaseNotificationCount(unreadData.unread_count);
        console.log('⭐️initializeUser⭐️');
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };
    initializeUser();
  }, [accessToken, clearProfile, fetchMyProfile, fetchMyRooms, connect]);

  const clickCreateRoom = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsRoomCreateModalOpen(true);
  };

  const clickNotification = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsNotificationModalOpen(true);
    resetNotificationCount();
  };

  const handleCancelNotification = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsNotificationModalOpen(false);
  };

  const clickProfile = () => {
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
          <ButtonBox onClick={clickCreateRoom}>
            <img src={AddCircleIcon} alt="Create Room" />
          </ButtonBox>
          <ButtonBox onClick={clickNotification}>
            <img src={BellIcon} alt="Notification" />
            {isNotificationModalOpen && <NotificationModal onCancel={handleCancelNotification} />}
            {newNotificationCount > 0 && (
              <NotificationCount>{newNotificationCount}</NotificationCount>
            )}
          </ButtonBox>
          {user ? (
            <ProfileButton onClick={clickProfile}>
              <img
                src={user.profileImageUrl ?? DefaultProfile}
                alt="Profile"
                onError={e => {
                  e.currentTarget.src = DefaultProfile;
                }}
              />
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
