import styled from 'styled-components';

interface VideoItemContainerProps {
  $active?: boolean;
  $isDragging?: boolean;
  $isPreview?: boolean;
}

export const Container = styled.div<VideoItemContainerProps>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 5px;
  padding: 16px 8px;
  background-color: ${({ $isPreview }) =>
    $isPreview ? 'var(--palette-line-normal-normal)' : 'var(--palette-static-white)'};
  border-bottom: 1px solid var(--palette-line-normal-alternative);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &.dragging {
    opacity: 0.3;
  }

  &.preview-item {
    opacity: 0.5;
    background-color: var(--color-gray);
  }

  &.shift-down {
    transform: translateY(100%);
    transition: transform 0.2s ease;
  }

  &.shift-up {
    transform: translateY(-100%);
    transition: transform 0.2s ease;
  }

  &:hover .button-container {
    opacity: ${({ $isDragging }) => ($isDragging ? 0 : 1)};
    visibility: ${({ $isDragging }) => ($isDragging ? 'hidden' : 'visible')};
  }
`;

export const Thumbnail = styled.img`
  width: 100px;
  aspect-ratio: 16/9;
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
  line-height: 15px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: black;
`;

export const Playlist__Youtuber = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #888888;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: end;
  position: absolute;
  top: 0px;
  left: 0px;
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
