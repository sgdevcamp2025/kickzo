import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // URL에서 q 값 가져오기

  return (
    <div>
      <h2>검색 결과</h2>
      <Pharagraph>검색어: {query || '검색어가 없습니다.'}</Pharagraph>
    </div>
  );
};

const Pharagraph = styled.span`
  background-color: gray;
`;
