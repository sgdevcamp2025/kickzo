import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import { useVideoStore } from '@/stores/useVideoStore';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;

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
  const { connect, subscribeRoomPlaylistUpdate } = useWebSocketStore();
  const { currentRoom } = useCurrentRoomStore();
  const { setVideoQueue } = useVideoStore();
  const roomId = currentRoom?.roomDetails?.roomInfo?.[0]?.roomId;
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

  // YouTube API를 이용하여 영상 정보(제목 & 유튜버) 가져오기
  const fetchVideoDetails = async (videoIds: string[]) => {
    if (!videoIds.length) return {};

    try {
      const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet',
          id: videoIds.join(','),
          key: API_KEY,
          hl: 'ko',
        },
      });

      const videoDetailsMap: Record<string, { title: string; youtuber: string }> = {};
      data.items.forEach(
        (item: { id: string; snippet: { title: string; channelTitle: string } }) => {
          videoDetailsMap[item.id] = {
            title: item.snippet.title,
            youtuber: item.snippet.channelTitle,
          };
        },
      );

      return videoDetailsMap;
    } catch (error) {
      console.error('YouTube API 호출 실패:', error);
      return {};
    }
  };

  // 방의 플레이리스트 업데이트 구독
  useEffect(() => {
    if (!roomId) return;

    subscribeRoomPlaylistUpdate(roomId, async data => {
      console.log('플레이리스트 업데이트 수신:', data);

      if (data?.playlist && Array.isArray(data.playlist)) {
        const sortedPlaylist = data.playlist.sort((a, b) => a.order - b.order);

        const videoIds = sortedPlaylist
          .map(item => {
            return item.url.split('v=')[1]?.split('&')[0] || '';
          })
          .filter(id => id);

        const videoDetailsMap = await fetchVideoDetails(videoIds);

        const updatedQueue = sortedPlaylist.map(item => {
          const videoId = item.url.split('v=')[1]?.split('&')[0] || '';
          return {
            id: videoId,
            start: parseInt(item.url.split('t=')[1] || '0', 10),
            thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
            title: item.title || videoDetailsMap[videoId]?.title || '제목 없음',
            youtuber: item.youtuber || videoDetailsMap[videoId]?.youtuber || '유튜버 정보 없음',
          };
        });
        setVideoQueue(updatedQueue);
      }
    });
  }, [roomId, subscribeRoomPlaylistUpdate, setVideoQueue]);

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
