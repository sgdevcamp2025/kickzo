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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  cursor: pointer;
`;

export const InputContainer = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid var(--palette-line-solid-neutral);
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 36px;
  border: none;
  background-color: #f4f4f4;
  border-radius: 5px;
  padding: 0 10px;
  border: none;
  outline: none;
`;

export const PreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
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

export const PreviewInfo__Title = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 15px;
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
  cursor: pointer;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;
