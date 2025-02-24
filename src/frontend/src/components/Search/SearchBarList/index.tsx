import { SearchListItem } from '@/components/Search/SearchBarListItem';
import { TotalLi, Ul } from './index.css';
import { SearchUserDto, RoomDto } from '@/api/endpoints/room/room.interface';

export const SearchBarList = ({
  searchUserList,
  searchRoomList,
  searchWord,
  resetSearchState,
  totalLength,
  targetIndex,
}: {
  searchUserList: SearchUserDto[];
  searchRoomList: RoomDto[];
  resetSearchState: () => void;
  searchWord?: string;
  totalLength: number;
  targetIndex?: number;
}) => {
  return (
    <Ul>
      {searchUserList.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.nickname}
            resetSearchState={resetSearchState}
            isTargetIndex={targetIndex === index}
            imageUrl={item.profileImageUrl}
            type="user"
          />
        );
      })}
      {searchRoomList.map((item, index: number) => {
        return (
          <SearchListItem
            key={index + searchUserList.length}
            inputText={searchWord}
            resultText={item.title}
            resetSearchState={resetSearchState}
            isTargetIndex={targetIndex === index + searchUserList.length}
            imageUrl={item.playlistUrl}
            type="room"
          />
        );
      })}
      {<TotalLi>검색 결과: {totalLength}</TotalLi>}
    </Ul>
  );
};
