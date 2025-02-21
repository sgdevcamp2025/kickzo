import { useState, useEffect, useRef } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { ProfileDetail } from '@/components/common/ProfileDetail';
import { UserListFooter } from '@/components/Sidebar/UserList/UserListFooter';
import { RedBlackTree } from '@/hooks/utils/RedBlackTree';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';

import { roomApi } from '@/api/endpoints/room/room.api';
import { useWebSocketStore } from '@/stores/useWebSocketStore';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
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
  const { currentRoom } = useCurrentRoomStore();
  const roomId = currentRoom?.roomDetails.roomInfo[0]?.roomId;

  const { subTopic } = useWebSocketStore();

  useEffect(() => {
    if (roomId) {
      // 새 레드블랙 트리 생성
      treeRef.current = new RedBlackTree<IUser>(compareUsers);
      roomApi
        .getParticipants(roomId.toString())
        .then(
          (
            participants: {
              userId: number;
              role: number;
              nickname: string;
              profileImageUrl: string;
            }[],
          ) => {
            participants.forEach(participant => {
              const user: IUser = {
                id: participant.userId,
                role: participant.role,
                nickname: participant.nickname,
                profileImg: participant.profileImageUrl || DefaultProfile,
              };
              treeRef.current?.insert(user);
            });
            setVersion(v => v + 1);
          },
        )
        .catch(error => {
          console.error('Error fetching participants', error);
        });
    }
  }, [roomId]);

  // 신규 유저 정보 받기
  useEffect(() => {
    if (!roomId) return;
    subTopic(
      `/topic/room/${roomId}/user-info`,
      (data: {
        userInfo: { userId: number; role: number; nickname: string; profileImageUrl: string };
      }) => {
        console.log('📥 웹소켓 수신 (user-info):', data);
        if (data && data.userInfo) {
          const userInfo = data.userInfo;
          const newUser: IUser = {
            id: userInfo.userId,
            role: userInfo.role,
            nickname: userInfo.nickname,
            profileImg: userInfo.profileImageUrl || DefaultProfile,
          };
          addUser(newUser);
        }
      },
    );
  }, [roomId, subTopic]);

  useEffect(() => {
    if (!roomId) return;
    subTopic(
      `/topic/room/${roomId}/role-change`,
      (data: { targetUserId: number; newRole: number }) => {
        console.log('📥 웹소켓 수신 (role-change):', data);
        if (data && data.targetUserId !== undefined && data.newRole !== undefined) {
          updateUserRole(data.targetUserId, data.newRole);
        }
      },
    );
  }, [roomId, subTopic]);

  // 유저 추가 함수
  const addUser = (user: IUser) => {
    if (!treeRef.current) return;
    treeRef.current.insert(user);
    setVersion(v => v + 1);
  };

  // role 변경된 유저 업데이트 함수
  const updateUserRole = (targetUserId: number, newRole: number) => {
    if (!treeRef.current) return;
    // 기존 트리에서 모든 유저 목록을 가져온 후, 해당 유저의 role만 변경
    const users = treeRef.current.inOrderTraversal();
    const updatedUsers = users.map(user => {
      if (user.id === targetUserId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    // 새로운 레드블랙 트리로 재구성
    treeRef.current = new RedBlackTree<IUser>(compareUsers);
    updatedUsers.forEach(user => treeRef.current?.insert(user));
    setVersion(v => v + 1);
  };

  // 레드블랙 트리로 정렬된 유저 목록 반환
  const getSortedUsers = (): IUser[] => {
    return treeRef.current ? treeRef.current.inOrderTraversal() : [];
  };

  const [activeProfile, setActiveProfile] = useState<number | null>(null);

  const handleProfileClick = (id: number) => {
    setActiveProfile(prevId => (prevId === id ? null : id));
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
                roomId={roomId}
                nickname={member.nickname}
                imgUrl={member.profileImg}
                userRole={member.role}
                myRole={UserRole.CREATOR}
                sidebarType={SidebarType.USERLIST}
              />
            )}
          </ProfileWrapper>
        ))}
      </UserListContainer>
      <UserListFooter sidebarType={SidebarType.USERLIST} />
    </Container>
  );
};
