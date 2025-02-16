import { useState } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { ProfileDetail } from '@/components/common/ProfileDetail';
import { MemberListFooter } from '@/components/Sidebar/MemberList/MemberListFooter';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';

import { useUserList, IUser } from '@/hooks/utils/useUserList';
import { Container, UserList, ProfileWrapper } from './index.css';

export const MemberList = () => {
  const { addUser, getSortedUsers } = useUserList();
  const [activeProfile, setActiveProfile] = useState<number | null>(null);

  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
  };

  const handleAddUser = () => {
    const newUser: IUser = {
      id: Date.now(),
      role: Math.floor(Math.random() * 3),
      nickname: `User${Math.floor(Math.random() * 1000)}`,
      profileImg: '',
    };
    addUser(newUser);
  };

  const users = getSortedUsers();

  return (
    <Container>
      <UserList>
        {users.map(member => (
          <ProfileWrapper key={member.id}>
            <div onClick={() => handleProfileClick(member.id)}>
              <SmallProfile
                type={ProfileType.MEMBER}
                role={member.role}
                nickname={member.nickname}
                imgUrl={member.profileImg}
              />
            </div>
            {activeProfile === member.id && (
              <ProfileDetail
                userId={member.id}
                userRole={member.role}
                myRole={UserRole.CREATOR}
                sidebarType={SidebarType.MEMBER}
              />
            )}
          </ProfileWrapper>
        ))}
      </UserList>
      <button onClick={handleAddUser}>랜덤 유저 추가</button>
      <MemberListFooter sidebarType={SidebarType.MEMBER} />
    </Container>
  );
};
