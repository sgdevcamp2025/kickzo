import { useState } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { ProfileDetail } from '@/components/common/ProfileDetail';
import { MemberListFooter } from '@/components/Sidebar/MemberList/MemberListFooter';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';
import { memberListTest } from '@/assets/data/memberListTest';

import { Container, UserList, ProfileWrapper } from './index.css';

export const VoiceChat = () => {
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
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
                  type={ProfileType.VOICECHAT}
                  role={member.role}
                  nickname={member.nickname}
                  imgUrl={member.profileImg}
                />
              </div>
              {activeProfile === member.id ? (
                <div className={`profile-detail ${activeProfile === member.id ? 'active' : ''}`}>
                  <ProfileDetail
                    userId={member.id}
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
      <MemberListFooter sidebarType={SidebarType.VOICECHAT} />
    </Container>
  );
};
