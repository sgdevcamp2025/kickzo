import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

export const UserFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  border-top: 1px solid var(--palette-line-solid-neutral);
  cursor: pointer;
`;

export const UserInviteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
`;

export const VoiceChatFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  gap: 8px;
  border-top: 1px solid var(--palette-line-solid-neutral);
`;

export const ActionButton = styled.button`
  border: none;
  padding: 10px;
  border-radius: 50%;
  background-color: #f4f4f4;
  cursor: pointer;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
`;

export const JoinButton = styled.button`
  width: 100%;
  border: none;
  background-color: #ff9100;
  padding: 10px 20px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
`;

export const ProfileWrapper = styled.div`
  position: relative;
  cursor: pointer;

  & .profile-detail {
    position: absolute;
    top: 0px;
    right: 60%;
    transform: translateX(-50%);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    z-index: 10;
  }

  .profile-detail.active {
    opacity: 1;
    visibility: visible;
  }
`;
