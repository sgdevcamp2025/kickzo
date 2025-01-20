import { SmallProfile } from '@/components/common/smallprofile';
import { Input } from '@/components/common/input';

import AddUserIcon from '@/assets/img/AddUser.svg';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import { memberListTest } from '@/assets/data/memberListTest';

import {
  Container,
  Container__UserList,
  MemberFooter,
  VoiceChatFooter,
  ActionButton,
  JoinButton,
} from './index.css';

enum SidebarType {
  Chat = 0,
  Playlist = 1,
  VoiceChat = 2,
  Member = 3,
}

interface IMemberListProps {
  sidebarType?: SidebarType;
}

export const MemberList = ({ sidebarType }: IMemberListProps) => {
  const renderFooter = () => {
    if (sidebarType === SidebarType.Member) {
      return (
        <MemberFooter>
          <img src={AddUserIcon} alt="Add User" />
          <Input placeholder="룸 유저 검색" design={1} />
        </MemberFooter>
      );
    }

    if (sidebarType === SidebarType.VoiceChat) {
      return (
        <VoiceChatFooter>
          <ActionButton>
            <img src={MicrophoneOn} />
          </ActionButton>
          <ActionButton>
            <img src={HeadphoneOn} />
          </ActionButton>
          <JoinButton>입장</JoinButton>
        </VoiceChatFooter>
      );
    }
    return null;
  };

  return (
    <Container>
      <Container__UserList>
        {memberListTest
          .sort((a, b) => a.role - b.role)
          .map(member => (
            <SmallProfile
              type={sidebarType === SidebarType.VoiceChat ? 1 : 0}
              key={member.id}
              role={member.role}
              nickname={member.nickname}
              imgUrl={member.profileImg}
            />
          ))}
      </Container__UserList>
      {renderFooter()}
    </Container>
  );
};
