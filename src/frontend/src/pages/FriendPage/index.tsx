import { NoFriendView } from './NoFriendView';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect } from 'react';
import { Wrapper, Container, SubTitle, Title } from '@/ui/Common.css';
import { FriendCard } from '@/components/Friend/FriendCard';
import { FriendGrid } from './index.css';
import { FriendSkeleton } from './FriendSkeleton';
import { useDelayedLoading } from '@/hooks/utils/useDelayedLoading';
import { useFriendStore } from '@/stores/useFriendStore';

export const FriendPage = () => {
  const { user } = useUserStore();
  const { friends, fetchFriends } = useFriendStore();
  const showSkeleton = useDelayedLoading(friends);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  if (showSkeleton) {
    return <FriendSkeleton />;
  }

  if (friends.length === 0) {
    return <NoFriendView />;
  }

  return (
    <Wrapper>
      <Container>
        <Title>친구</Title>
        <SubTitle>친구 목록</SubTitle>
        <FriendGrid>
          {friends.map(friend => (
            <FriendCard key={friend.friend_id} friend={friend} />
          ))}
        </FriendGrid>
      </Container>
    </Wrapper>
  );
};
