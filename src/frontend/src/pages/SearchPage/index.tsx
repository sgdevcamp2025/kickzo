import { roomApi } from '@/api/endpoints/room/room.api';
import { SearchUserDto, RoomDto } from '@/api/endpoints/room/room.interface';
import { SearchRoomItem } from '@/components/Search/SearchItem/SearchRoomItem';
import { SearchUserItem } from '@/components/Search/SearchItem/SearchUserItem';
import { Container, Divider, SubTitle, Title, Wrapper } from '@/ui/Common.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // URL에서 q 값 가져오기
  const [searchUserList, setSearchUserList] = useState<SearchUserDto[]>([]);
  const [searchRoomList, setSearchRoomList] = useState<RoomDto[]>([]);
  const [totalLength, setTotalLength] = useState<number>(0);
  useEffect(() => {
    if (query) {
      const fetchSearchList = async () => {
        const searchListData = await roomApi.searchFromElastic(query);
        console.log('searchListData: ', searchListData);
        setSearchUserList(searchListData.users);
        setSearchRoomList(searchListData.rooms);
        setTotalLength(searchListData.users.length + searchListData.rooms.length);
      };
      fetchSearchList();
    }
  }, [query]);

  return (
    <Wrapper>
      <Container>
        <Title>검색 {totalLength}건</Title>
        <SubTitle>유저 {searchUserList.length}명</SubTitle>
        {searchUserList.map(user => (
          <SearchUserItem key={user.userId} user={user} />
        ))}
        <Divider />
        <SubTitle>방 {searchRoomList.length}개</SubTitle>
        {searchRoomList.map(room => (
          <SearchRoomItem key={room.roomId} room={room} />
        ))}
      </Container>
    </Wrapper>
  );
};
