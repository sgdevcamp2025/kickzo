import { friendApi } from '@/api/endpoints/friend/friend.api';
import { NoFriendView } from './NoFriendView';
import { useUserStore } from '@/stores/useUserStore';
import { useFriend } from '@/hooks/queries/useFriend';
import { useEffect, useState } from 'react';
import { FriendDto } from '@/api/endpoints/friend/friend.interface';
import { Wrapper, Container, SubTitle, Title } from '@/ui/Common.css';
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { FriendCard } from '@/components/Friend/FriendCard';
import { FriendGrid } from './index.css';
import { FriendSkeleton } from './FriendSkeleton';
import { useDelayedLoading } from '@/hooks/utils/useDelayedLoading';
import { FriendConnectionMessage } from '@/types/dto/Friend.dto';

export const FriendPage = () => {
  const { user } = useUserStore();
  const getFriends = useFriend();
  const showSkeleton = useDelayedLoading(getFriends.data);
  const [friends, setFriends] = useState<FriendDto[]>([]);

  useEffect(() => {
    if (getFriends.data) {
      setFriends(getFriends.data);
    }
    if (user) {
      useWebSocketStore.getState().subscribeFriendConnection<FriendConnectionMessage>(
        user.userId,
        message => {
          setFriends(prev =>
            prev.map(friend =>
              friend.friend_id === message.userId ? { ...friend, status: message.status } : friend,
          ),
        );
      });
    }
  }, [getFriends.data, user]);

  if (showSkeleton) {
    return <FriendSkeleton />;
  }

  if (getFriends.error) {
    return <div>데이터를 받아오지 못했습니다.</div>;
  }

  if (friends.length === 0) {
    return <NoFriendView />;
  }

  const requestFriend = async () => {
    if (!user) return;
    const data = await friendApi.requestFriend(user.userId, 6);
    console.log(data);
  };

  const acceptFriend = async () => {
    if (!user) return;
    const data = await friendApi.acceptFriend(6, user.userId);
    console.log(data);
  };

  const rejectFriend = async () => {
    if (!user) return;
    const data = await friendApi.rejectFriend(user.userId, 6);
    console.log(data);
  };

  const getNotifications = async () => {
    const data = await friendApi.getNotifications();
    console.log(data);
  };

  const getUnreadNotificationsCount = async () => {
    const data = await friendApi.getUnreadNotificationsCount();
    console.log(data);
  };

  return (
    <Wrapper>
      <Container>
        <Title>친구</Title>
        <SubTitle>친구 목록</SubTitle>
        <div>
          {/* <button onClick={getFriends}>친구 목록</button> */}
          <button onClick={requestFriend}>친구 요청</button>
          <button onClick={acceptFriend}>수락</button>
          <button onClick={rejectFriend}>거절</button>
          <button onClick={getNotifications}>알림 정보</button>
          <button onClick={getUnreadNotificationsCount}>알림 갯수</button>
        </div>
        <FriendGrid>
          {friends.map(friend => (
            <FriendCard key={friend.friend_id} friend={friend} />
          ))}
        </FriendGrid>
      </Container>
    </Wrapper>
  );
};
