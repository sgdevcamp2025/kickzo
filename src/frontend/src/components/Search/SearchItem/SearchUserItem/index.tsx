import { useEffect, useState } from 'react';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import AddUser from '@/assets/img/AddUser.svg';
import { CircleButton } from '@/components/IconButton/index.css';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { useUserStore } from '@/stores/useUserStore';
import Check from '@/assets/img/Check.svg';
import { useFriendStore } from '@/stores/useFriendStore';
import UsersFill from '@/assets/img/UsersFill.svg';
import { useNotificationStore } from '@/stores/useNotificationStore';
import {
  SearchItemContainer,
  SearchItemContent,
  SearchItemProfileImage,
  SearchItemInfo,
  SearchItemNickname,
  SearchItemStateMessage,
} from './index.css';
import { SearchUserDto } from '@/api/endpoints/room/room.interface';
import axios from 'axios';

export const SearchUserItem = ({ user }: { user: SearchUserDto }) => {
  const { user: me } = useUserStore();
  const { friends } = useFriendStore();
  const { notifications } = useNotificationStore();
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const isFriend = friends.some(friend => friend.friend_id === user.userId);
  const hasRequested = notifications.some(
    notification => notification.senderId === user.userId && notification.status === 'PENDING',
  );

  useEffect(() => {
    if (hasRequested) {
      setAlreadyRequested(true);
    }
  }, [hasRequested]);

  const handleAddFriend = async () => {
    if (!me || isFriend || alreadyRequested || hasRequested) return;

    try {
      await friendApi.requestFriend(me.userId, user.userId);
      setAlreadyRequested(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        const errorMessage = error.response.data.detail;
        if (errorMessage === '이미 친구 요청을 보냈습니다.') {
          setAlreadyRequested(true);
        }
        alert(errorMessage);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <SearchItemContainer>
      <SearchItemContent>
        <SearchItemProfileImage>
          <img
            src={user.profileImageUrl ?? DefaultProfile}
            onError={e => {
              e.currentTarget.src = DefaultProfile;
            }}
            alt="profile"
          />
        </SearchItemProfileImage>
        <SearchItemInfo>
          <SearchItemNickname>{user.nickname}</SearchItemNickname>
          {user.stateMessage && (
            <SearchItemStateMessage>{user.stateMessage}</SearchItemStateMessage>
          )}
        </SearchItemInfo>
      </SearchItemContent>
      {me && me.userId !== user.userId && (
        <CircleButton
          onClick={handleAddFriend}
          $backgroundColor={
            alreadyRequested
              ? 'var(--palette-primary)'
              : isFriend
                ? 'var(--palette-static-white)'
                : undefined
          }
          title={isFriend ? '이미 친구입니다' : ''}
        >
          <div>
            <img
              src={isFriend ? UsersFill : alreadyRequested || hasRequested ? Check : AddUser}
              alt="친구 추가"
            />
          </div>
        </CircleButton>
      )}
    </SearchItemContainer>
  );
};
