import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: relative;
  background-color: var(--palette-static-white);
  border-radius: 10px;
  padding: 10px;
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProfileImage = styled.img<{ $onClick: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    cursor: ${({ $onClick }) => ($onClick ? 'pointer' : 'default')};
    opacity: ${({ $onClick }) => ($onClick ? 0.7 : 1)};
  }
`;

export const HeaderButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const ErrorMessage = styled.p`
  position: absolute;
  bottom: -36px;
  left: 0;
  color: var(--palette-static-white);
  font-size: 0.875rem;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--palette-label-neutral);
  width: 100%;
`;

export const NicknameText = styled.p`
  padding: 4px;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
`;

export const StateMessageText = styled.p`
  padding: 4px;
  margin-top: -2px;
`;

export const StateMessagePlus = styled.button`
  padding: 4px 0;
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 2px;
  color: var(--palette-font-gray-strong);
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: 4px;
  margin-top: -8px;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: var(--palette-background-notification);
  }

  & > img {
    width: 24px;
    height: 24px;
  }
`;

export const NicknameInput = styled.input<{ $isEditMode: boolean }>`
  padding: 4px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $isEditMode }) =>
    $isEditMode ? 'var(--palette-line-solid-normal)' : 'white'};
  font-size: 18px;
`;

export const StateMessageInput = styled.input<{ $isEditMode: boolean }>`
  padding: 4px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $isEditMode }) =>
    $isEditMode ? 'var(--palette-line-solid-normal)' : 'white'};
  font-size: 16px;
`;
