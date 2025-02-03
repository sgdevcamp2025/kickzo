import { useState } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { CommonInput } from '@/components/common/Input';
import { BigProfile } from '@/components/common/BigProfile';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';

import AddUserIcon from '@/assets/img/AddUser.svg';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import { memberListTest } from '@/assets/data/memberListTest';

import {
  Container,
  UserList,
  MemberFooter,
  VoiceChatFooter,
  ActionButton,
  JoinButton,
  ProfileWrapper,
} from './index.css';

interface IMemberListProps {
  sidebarType?: SidebarType;
}

export const MemberList = ({ sidebarType }: IMemberListProps) => {
  const [micOn, setMicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [activeProfile, setActiveProfile] = useState<number | null>(null);

  // TODO - 마이크 소리 on/off
  const handleMicrophone = () => setMicOn(!micOn);
  const handleSound = () => setSoundOn(!soundOn);
  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
  };

  const renderFooter = () => {
    if (sidebarType === SidebarType.Member) {
      return (
        <MemberFooter>
          <img src={AddUserIcon} alt="Add User" />
          <CommonInput placeholder="룸 유저 검색" design={1} />
        </MemberFooter>
      );
    }

    if (sidebarType === SidebarType.VoiceChat) {
      return (
        <VoiceChatFooter>
          <ActionButton onClick={handleMicrophone}>
            <img src={micOn ? MicrophoneOn : MicrophoneOffRed} />
          </ActionButton>
          <ActionButton onClick={handleSound}>
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
            <ProfileWrapper key={member.id}>
              <div onClick={() => handleProfileClick(member.id)}>
                <SmallProfile
                  type={
                    sidebarType === SidebarType.VoiceChat
                      ? ProfileType.VOICECHAT
                      : ProfileType.MEMBER
                  }
                  role={member.role}
                  nickname={member.nickname}
                  imgUrl={member.profileImg}
                />
              </div>
              {activeProfile === member.id ? (
                <div className={`big-profile ${activeProfile === member.id ? 'active' : ''}`}>
                  <BigProfile
                    userId={member.id}
                    userRole={member.role}
                    myRole={UserRole.OWNER}
                    sidebarType={sidebarType || SidebarType.Member}
                  />
                </div>
              ) : (
                ''
              )}
            </ProfileWrapper>
          ))}
      </UserList>
      {renderFooter()}
    </Container>
  );
};
