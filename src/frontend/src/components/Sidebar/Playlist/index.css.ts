import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

interface VideoItemProps {
  $active?: boolean;
}

export const VideoItem = styled.div<VideoItemProps>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ $active }) => ($active ? '#f8d7da' : '#fff')};
  border: ${({ $active }) => ($active ? '2px solid #ff0000' : '1px solid #ddd')};
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

export const PreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  &:hover .overlay {
    opacity: 1;
    cursor: pointer;
  }
`;

export const PreviewImg = styled.img`
  height: 80px;
  display: block;
  border-radius: 8px;
  margin-right: 10px;
`;

export const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  gap: 10px;
`;

export const Playlist__Title = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14.52px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: black;
`;

export const Playlist__Youtuber = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 14.52px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #888888;
`;

export const PreviewInfo__Title = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14.52px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;

export const PreviewInfo__Youtuber = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 14.52px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #888888;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
`;
