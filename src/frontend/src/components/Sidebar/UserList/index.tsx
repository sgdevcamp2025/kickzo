import { useState, useEffect, useRef } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { UserListFooter } from '@/components/Sidebar/UserList/UserListFooter';
import { RedBlackTree } from '@/hooks/utils/RedBlackTree';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';

import { roomApi } from '@/api/endpoints/room/room.api';
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import { Container, UserListContainer, ProfileWrapper } from './index.css';
import { RoomProfileModal } from '@/components/Modal/RoomProfileModal';

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
  const currentRoom = useCurrentRoomStore(state => state.currentRoom);
  const roomId = useCurrentRoomStore(state => state.roomId);
  const { subscribeRoomUserInfo, subscribeRoomRoleChange } = useWebSocketStore.getState();

  useEffect(() => {
    if (roomId) {
      // 새 레드블랙 트리 생성
      treeRef.current = new RedBlackTree<IUser>(compareUsers);
      roomApi
        .getParticipants(roomId.toString())
        .then(participants => {
          participants.forEach(
            (participant: {
              userId: number;
              role: number;
              nickname: string;
              profileImageUrl: string;
            }) => {
              const user: IUser = {
                id: participant.userId,
                role: participant.role,
                nickname: participant.nickname,
                profileImg: participant.profileImageUrl || DefaultProfile,
              };
              treeRef.current?.insert(user);
            },
          );
          setVersion(v => v + 1);
        })
        .catch(error => {
          console.error('Error fetching participants', error);
        });
    }
  }, [roomId]);

  // 신규 유저 정보 받기
  useEffect(() => {
    if (!roomId) return;
    subscribeRoomUserInfo(roomId, data => {
      console.log('📥 웹소켓 수신 (user-info):', data);
      if (data?.userInfo) {
        const userInfo = data.userInfo;
        const newUser: IUser = {
          id: userInfo.userId,
          role: userInfo.role,
          nickname: userInfo.nickname,
          profileImg: userInfo.profileImageUrl || DefaultProfile,
        };
        treeRef.current?.insert(newUser);
        setVersion(v => v + 1);
      }
    });
  }, [roomId, subscribeRoomUserInfo]);

  // 역할 변경 받기
  useEffect(() => {
    if (!roomId) return;
    subscribeRoomRoleChange(roomId, data => {
      console.log('📥 웹소켓 수신 (role-change):', data);
      if (data && data.targetUserId !== undefined && data.newRole !== undefined) {
        const users = treeRef.current?.inOrderTraversal() || [];
        const updatedUsers = users.map(user => {
          if (user.id === data.targetUserId) {
            return { ...user, role: data.newRole };
          }
          return user;
        });
        treeRef.current = new RedBlackTree<IUser>(compareUsers);
        updatedUsers.forEach(user => treeRef.current?.insert(user));
        setVersion(v => v + 1);
      }
    });
  }, [roomId, subscribeRoomRoleChange]);

  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
  };

  const users = treeRef.current ? treeRef.current.inOrderTraversal() : [];

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
            {roomId && activeProfile === member.id && (
              <RoomProfileModal
                userId={member.id}
                roomId={roomId}
                nickname={member.nickname}
                imgUrl={member.profileImg}
                userRole={member.role}
                myRole={currentRoom?.myRole || 2}
                sidebarType={SidebarType.USERLIST}
                onCancel={() => setActiveProfile(null)}
              />
            )}
          </ProfileWrapper>
        ))}
      </UserListContainer>
      <UserListFooter sidebarType={SidebarType.USERLIST} />
    </Container>
  );
};
