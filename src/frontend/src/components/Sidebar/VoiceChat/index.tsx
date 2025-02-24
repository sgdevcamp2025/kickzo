import { useState } from 'react';
import { SmallProfile } from '@/components/common/SmallProfile';
import { UserListFooter } from '@/components/Sidebar/UserList/UserListFooter';

import { SidebarType } from '@/types/enums/SidebarType';
import { ProfileType } from '@/types/enums/ProfileType';
import { UserRole } from '@/types/enums/UserRole';

import { Container, UserList, ProfileWrapper } from './index.css';
import { CurrentRoomUserDto } from '@/api/endpoints/room/room.interface';
import { RoomProfileModal } from '@/components/Modal/RoomProfileModal';
import { useCurrentRoomStore } from '@/stores/useCurrentRoomStore';
export const VoiceChat = () => {
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const { currentRoom } = useCurrentRoomStore();
  const roomId = currentRoom?.roomDetails.roomInfo[0]?.roomId;
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
            {roomId && activeProfile === member.userId ? (
              <RoomProfileModal
                nickname={member.nickname}
                imgUrl={member.profileImageUrl}
                userId={member.userId}
                userRole={member.role}
                myRole={UserRole.CREATOR}
                sidebarType={SidebarType.VOICECHAT}
                roomId={roomId}
                onCancel={() => setActiveProfile(null)}
              />
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
