import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounceCallback from '@/hooks/utils/useDebounceCallback';
import SearchIcon from '@/assets/img/Search.svg';
import CancelIcon from '@/assets/img/Cancel.svg';
import { SearchBarList } from '@/components/Search/SearchBarList';
import {
  CancelIconBox,
  SearchBarContainer,
  SearchBarInput,
  SearchBarWrapper,
  SearchIconBox,
} from './index.css';
import { userApi } from '@/api/endpoints/user/user.api';
import { UserResponseDto } from '@/api/endpoints/user/user.interface';

export const SearchBar = () => {
  const navigate = useNavigate();
  const { debounce } = useDebounceCallback();
  const searchWrap = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState<boolean>(true);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalLength, setTotalLength] = useState<number>(0);
  const [searchList, setSearchList] = useState<UserResponseDto[]>([]);
  const enterKeyProcessed = useRef(false);

  useEffect(() => {
    if (targetIndex !== -1) {
      searchInput.current!.value = searchList[targetIndex]?.nickname;
      setSearchValue(searchInput.current!.value);
    }
  }, [targetIndex]);

  const resetSearchState = () => {
    setSearchList([]);
    setTotalLength(0);
    setTargetIndex(-1);
    if (searchInput.current) {
      searchInput.current.value = '';
      setSearchValue('');
    }
  };

  const handleSearchInput = async () => {
    if (searchInput.current) {
      setSearchValue(searchInput.current.value);
      const searchValue = searchInput.current.value;
      if (searchValue.length <= 0) {
        setTotalLength(0);
        setTargetIndex(-1);
        return;
      } else {
        // 검색어에 따른 검색 결과 리스트
        const searchListData = await userApi.getUsers(0, 30, searchValue);
        setSearchList(searchListData.users);
        setTotalLength(searchListData.totalLength);
      }
    }
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (enterKeyProcessed.current) return;
        enterKeyProcessed.current = true;
        clickSearchButton();
        setTimeout(() => {
          enterKeyProcessed.current = false;
          resetSearchState();
        }, 0);
        break;
      case 'ArrowUp':
        if (totalLength > 0) {
          // 위로 이동
          setTargetIndex(prev => (prev > 0 ? prev - 1 : searchList.length - 1));
        }
        break;
      case 'ArrowDown':
        if (totalLength > 0) {
          // 아래로 이동
          setTargetIndex(prev => (prev < searchList.length - 1 ? prev + 1 : 0));
        }
        break;
    }
  };

  const clickSearchButton = () => {
    if (searchInput.current?.value) {
      setSearchValue(searchInput.current.value);
      const searchValue = searchInput.current.value;

      console.log('length: ', searchValue.length);
      if (searchValue.length <= 0) {
        resetSearchState();
        return alert('검색어를 입력해주세요.');
      } else {
        const query = `?q=${searchValue}`;
        navigate({
          pathname: 'search',
          search: query,
        });
        resetSearchState();
      }
    }
  };

  const clickCancelButton = () => {
    setIsFocus(false);
    resetSearchState();
  };

  return (
    <SearchBarWrapper ref={searchWrap} id="searchBar">
      <SearchBarContainer>
        <SearchBarInput
          ref={searchInput}
          type="text"
          placeholder="검색"
          onFocus={() => {
            setIsFocus(true);
          }}
          onChange={() => debounce('topNavSearch', handleSearchInput, 300)}
          onKeyDown={handleInputKey}
        ></SearchBarInput>
        {searchValue && (
          <CancelIconBox onClick={clickCancelButton}>
            <img src={CancelIcon} alt="Cancel" />
          </CancelIconBox>
        )}
        <SearchIconBox onClick={clickSearchButton}>
          <img src={SearchIcon} />
        </SearchIconBox>
      </SearchBarContainer>
      {isFocus && searchInput.current?.value && totalLength > 0 && (
        <>
          <SearchBarList
            searchList={searchList}
            searchWord={searchValue}
            resetSearchState={resetSearchState}
            totalLength={totalLength}
            targetIndex={targetIndex}
          />
        </>
      )}
    </SearchBarWrapper>
  );
};
