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
  const { users, addUser, removeUser } = useUserList();
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const [nickname, setNickname] = useState('');
  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
  };

  // 테스트용: 임의로 유저 만들어서 추가
  const handleAddUser = () => {
    const newUser: IUser = {
      id: Date.now(),
      role: Math.floor(Math.random() * 3),
      nickname: `User${Math.floor(Math.random() * 1000)}`,
      profileImg: '',
    };
    addUser(newUser);
  };

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
              <div className="profile-detail active">
                <ProfileDetail
                  userId={member.id}
                  userRole={member.role}
                  myRole={UserRole.CREATOR}
                  sidebarType={SidebarType.MEMBER}
                />
              </div>
            )}
          </ProfileWrapper>
        ))}
      </UserList>

      {/* 테스트용 버튼 start*/}
      <button onClick={handleAddUser}>랜덤 유저 추가</button>
      <input
        type="text"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        placeholder="삭제할 유저"
        style={{ marginLeft: '10px', padding: '5px', width: '120px' }}
      />
      <button onClick={() => removeUser(nickname)}>삭제</button>
      <MemberListFooter sidebarType={SidebarType.MEMBER} />
    </Container>
  );
};
