import { SearchListItem } from '@/components/Search/SearchBarListItem';
import { TotalLi, Ul } from './index.css';
import { UserResponseDto } from '@/api/endpoints/user/user.interface';
export const SearchBarList = ({
  searchList,
  searchWord,
  resetSearchState,
  totalLength,
  targetIndex,
}: {
  searchList: UserResponseDto[];
  resetSearchState: () => void;
  searchWord?: string;
  totalLength: number;
  targetIndex?: number;
}) => {
  return (
    <Ul>
      {searchList.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.nickname}
            resetSearchState={resetSearchState}
            isTargetIndex={targetIndex === index}
          />
        );
      })}
      {<TotalLi>검색 결과: {totalLength}</TotalLi>}
    </Ul>
  );
};
