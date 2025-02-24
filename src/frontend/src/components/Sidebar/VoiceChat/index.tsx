import { useState } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { ProfileDetail } from '@/components/common/ProfileDetail';
import { UserListFooter } from '@/components/Sidebar/UserList/UserListFooter';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';

import { Container, UserList, ProfileWrapper } from './index.css';
import { CurrentRoomUserDto } from '@/api/endpoints/room/room.interface';

export const VoiceChat = () => {
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
  };

  const memberList: CurrentRoomUserDto[] = [];

  const sortedUsers = memberList.sort((a, b) => {
    if (a.role !== b.role) {
      return a.role - b.role;
    }
    return a.nickname.localeCompare(b.nickname, 'ko');
  });

  return (
    <Container>
      <UserList>
        {sortedUsers.map(member => (
          <ProfileWrapper key={member.userId}>
            <div onClick={() => handleProfileClick(member.userId)}>
              <SmallProfile
                type={ProfileType.VOICECHAT}
                role={member.role}
                nickname={member.nickname}
                imgUrl={member.profileImageUrl}
              />
            </div>
            {activeProfile === member.userId ? (
              <div className={`profile-detail ${activeProfile === member.userId ? 'active' : ''}`}>
                <ProfileDetail
                  nickname={member.nickname}
                  imgUrl={member.profileImageUrl}
                  userId={member.userId}
                  userRole={member.role}
                  myRole={UserRole.CREATOR}
                  sidebarType={SidebarType.VOICECHAT}
                />
              </div>
            ) : (
              ''
            )}
          </ProfileWrapper>
        ))}
      </UserList>
      <UserListFooter sidebarType={SidebarType.VOICECHAT} />
    </Container>
  );
};
