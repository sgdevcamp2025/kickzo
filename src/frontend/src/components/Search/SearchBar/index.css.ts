import { styled } from 'styled-components';

export const SearchBarWrapper = styled.div`
  position: relative;
`;

export const SearchBarContainer = styled.div`
  width: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0 8px 0 20px;
  background: var(--palette-line-solid-alternative);
  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;

export const SearchBarInput = styled.input`
  flex-grow: 1;
  height: 40px;
  border: none;
  background: transparent;
  text-align: left;
  outline: none;
`;

export const SearchIconBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const CancelIconBox = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  background: var(--palette-line-solid-normal);

  & > img {
    width: 12px;
    height: 12px;
  }
`;
