import { userApi } from '@/api/endpoints/user/user.api';
import { UserResponseDto } from '@/api/endpoints/user/user.interface';
import { SearchItem } from '@/components/Search/SearchItem';
import { Container, SubTitle, Title, Wrapper } from '@/ui/Common.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
