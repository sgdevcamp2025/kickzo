import styled from 'styled-components';

interface IVideoItemContainer {
  $active?: boolean;
}

export const Container = styled.div<IVideoItemContainer>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ $active }) => ($active ? '#f8d7da' : '#fff')};
  border: ${({ $active }) => ($active ? '2px solid #ff0000' : '1px solid #ddd')};
  cursor: pointer;
  position: relative; /* 자식 요소의 위치 조정을 위해 추가 */

  &:hover .button-container {
    opacity: 1; /* hover 시 버튼 보이기 */
    visibility: visible;
  }
`;

export const Thumbnail = styled.img`
  width: 100px;
  height: 56px;
  object-fit: cover;
  border-radius: 5px;
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

export const ButtonContainer = styled.div`
  width: 300px;
  height: 100%;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  padding: 10px 0;
  align-items: end;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  & > div {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
