import styled from 'styled-components';

export const PlaylistContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const PlaylistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

interface VideoItemProps {
  active?: boolean;
}

export const VideoItem = styled.div<VideoItemProps>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ active }) => (active ? '#f8d7da' : '#fff')};
  border: ${({ active }) => (active ? '2px solid #ff0000' : '1px solid #ddd')};
  cursor: pointer;
`;

export const Thumbnail = styled.img`
  width: 100px;
  height: 56px;
  object-fit: cover;
  border-radius: 5px;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 40px;
  border: none;
  background-color: #f4f4f4;
  border-radius: 5px;
  padding: 0 10px;
`;
