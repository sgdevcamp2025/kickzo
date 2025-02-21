import { userApi } from '@/api/endpoints/user/user.api';
import { UserResponseDto } from '@/api/endpoints/user/user.interface';
import { Container, SubTitle, Title, Wrapper } from '@/ui/Common.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import AddUser from '@/assets/img/AddUser.svg';
import { CircleButton } from '@/components/IconButton/index.css';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { useUserStore } from '@/stores/useUserStore';
import Check from '@/assets/img/Check.svg';
import { useFriendStore } from '@/stores/useFriendStore';
import UsersFill from '@/assets/img/UsersFill.svg';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // URL에서 q 값 가져오기
  const [searchList, setSearchList] = useState<UserResponseDto[]>([]);
  const [totalLength, setTotalLength] = useState<number>(0);
  useEffect(() => {
    if (query) {
      const fetchSearchList = async () => {
        const searchListData = await userApi.getUsers(0, 100, query);
        console.log('searchListData: ', searchListData);
        setSearchList(searchListData.users);
        setTotalLength(searchListData.totalLength);
      };
      fetchSearchList();
    }
  }, [query]);

  return (
    <Wrapper>
      <Container>
        <Title>검색</Title>
        <SubTitle>검색 결과 {totalLength}개</SubTitle>
        {searchList.map(user => (
          <SearchItem key={user.userId} user={user} />
        ))}
      </Container>
    </Wrapper>
  );
};

const SearchItem = ({ user }: { user: UserResponseDto }) => {
  const { user: me } = useUserStore();
  const { friends } = useFriendStore();
  const [isRequested, setIsRequested] = useState(false);

  const handleAddFriend = async () => {
    if (me) {
      if (isRequested) return;
      try {
        await friendApi.requestFriend(me.userId, user.userId);
        setIsRequested(true);
      } catch (error) {
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as { response: { data: { detail: string } } };
          if (axiosError.response.data.detail === '이미 친구 요청을 보냈습니다.') {
            setIsRequested(true);
          }
          alert(axiosError.response.data.detail);
        } else {
          alert('An unexpected error occurred');
        }
      }
    }
  };

  const isFriend = friends.some(friend => friend.friend_id === user.userId);

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
          $backgroundColor={isRequested ? 'var(--palette-primary)' : undefined}
        >
          <img src={isFriend ? UsersFill : !isRequested ? AddUser : Check} alt="친구 추가" />
        </CircleButton>
      )}
    </SearchItemContainer>
  );
};

const SearchItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--palette-line-normal-alternative);
`;

const SearchItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const SearchItemProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 1rem;
`;

const SearchItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchItemNickname = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
`;

const SearchItemStateMessage = styled.div`
  font-size: 0.875rem;
  color: var(--palette-font-gray-strong);
  margin-top: 0.25rem;
`;
