import styled from 'styled-components';

import {
  VoiceChatFooter as OriginalFooter,
  ActionButton as OriginalActionButton,
  JoinButton as OriginalJoinButton,
} from '@/components/Sidebar/UserList/index.css.ts';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ParticipantsPreview = styled.div`
  flex: 0 0 auto;
  border-bottom: 1px solid #ddd;
  overflow-y: auto;
`;

export const VideoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: space-between;
`;

export const MyVideoSection = styled.p`
  display: flex;
  background-color: #eeeeee;
  border-radius: 10px;

  padding: 10px;
  align-items: center;
`;

export const RemoteVideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

export const FooterBar = styled(OriginalFooter)`
  margin-top: auto;
  position: static;
  padding: 10px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
`;

export const ActionButton = styled(OriginalActionButton)`
  margin: 0 5px;
`;

export const JoinButton = styled(OriginalJoinButton)`
  margin-left: 10px;
`;

//

// export const Container = styled.div`
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: space-between;
// `;

export const UserList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

export const MemberFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  border-top: 1px solid var(--palette-line-solid-neutral);
`;

export const VoiceChatFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-top: 1px solid var(--palette-line-solid-neutral);
`;

// export const ActionButton = styled.button`
//   border: none;
//   padding: 10px;
//   border-radius: 50%;
//   background-color: #f4f4f4;
//   cursor: pointer;
// `;

// export const JoinButton = styled.button`
//   width: 194px;
//   border: none;
//   background-color: #ff9100;
//   padding: 10px 20px;
//   color: white;
//   font-weight: bold;
//   border-radius: 5px;
//   cursor: pointer;
// `;

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
