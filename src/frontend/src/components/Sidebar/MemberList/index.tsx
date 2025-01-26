import { useState } from 'react';
import { SmallProfile } from '@/components/Common/Smallprofile';
import { CommonInput } from '@/components/Common/Input';
import {
  Container,
  UserList,
  MemberFooter,
  VoiceChatFooter,
  ActionButton,
  JoinButton,
} from './index.css';
import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';

import AddUserIcon from '@/assets/img/AddUser.svg';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import { memberListTest } from '@/assets/data/memberListTest';

interface IMemberListProps {
  sidebarType?: SidebarType;
}

export const MemberList = ({ sidebarType }: IMemberListProps) => {
  const [micOn, setMicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const renderFooter = () => {
    if (sidebarType === SidebarType.Member) {
      return (
        <MemberFooter>
          <img src={AddUserIcon} alt="Add User" />
          <CommonInput placeholder="룸 유저 검색" design={1} />
        </MemberFooter>
      );
    }

    const handleMicrophone = () => {
      setMicOn(!micOn);
    };
    const handleSound = () => {
      setSoundOn(!soundOn);
    };

    if (sidebarType === SidebarType.VoiceChat) {
      return (
        <VoiceChatFooter>
          <ActionButton onClick={() => handleMicrophone()}>
            <img src={micOn ? MicrophoneOn : MicrophoneOffRed} />
          </ActionButton>
          <ActionButton onClick={() => handleSound()}>
            <img src={soundOn ? HeadphoneOn : HeadphoneOffRed} />
          </ActionButton>
          <JoinButton>입장</JoinButton>
        </VoiceChatFooter>
      );
    }
    return null;
  };

  return (
    <Container>
      <UserList>
        {memberListTest
          .sort((a, b) => a.role - b.role)
          .map(member => (
            <SmallProfile
              type={
                sidebarType === SidebarType.VoiceChat ? ProfileType.VOICECHAT : ProfileType.MEMBER
              }
              key={member.id}
              role={member.role}
              nickname={member.nickname}
              imgUrl={member.profileImg}
            />
          ))}
      </UserList>
      {renderFooter()}
    </Container>
  );
};
