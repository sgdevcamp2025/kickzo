import { useState, useEffect, useRef } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { ProfileDetail } from '@/components/common/ProfileDetail';
import { UserListFooter } from '@/components/Sidebar/UserList/UserListFooter';
import { RedBlackTree } from '@/hooks/utils/RedBlackTree';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';

import { memberListTest } from '@/assets/data/memberListTest';
import { Container, UserListContainer, ProfileWrapper } from './index.css';

interface IUser {
  id: number;
  role: number;
  nickname: string;
  profileImg: string;
}

const compareUsers = (a: IUser, b: IUser): number => {
  if (a.role !== b.role) return a.role - b.role;
  const nicknameCompare = a.nickname.localeCompare(b.nickname, 'ko');
  if (nicknameCompare !== 0) return nicknameCompare;
  return a.id - b.id;
};

export const UserList = () => {
  const treeRef = useRef<RedBlackTree<IUser> | null>(null);
  const [, setVersion] = useState(0);

  useEffect(() => {
    treeRef.current = new RedBlackTree<IUser>(compareUsers);
    memberListTest.forEach(user => treeRef.current?.insert(user));
    setVersion(v => v + 1);
  }, []);

  const addUser = (user: IUser) => {
    if (!treeRef.current) return;
    treeRef.current.insert(user);
    setVersion(v => v + 1);
  };

  const getSortedUsers = (): IUser[] => {
    return treeRef.current ? treeRef.current.inOrderTraversal() : [];
  };
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
      <UserListContainer>
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
                sidebarType={SidebarType.USERLIST}
              />
            )}
          </ProfileWrapper>
        ))}
      </UserListContainer>
      <button onClick={handleAddUser}>랜덤 유저 추가</button>
      <UserListFooter sidebarType={SidebarType.USERLIST} />
    </Container>
  );
};
