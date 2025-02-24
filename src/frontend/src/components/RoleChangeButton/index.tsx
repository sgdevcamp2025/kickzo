import { useState } from 'react';
import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { UserRole } from '@/types/enums/UserRole';
import { roomApi } from '@/api/endpoints/room/room.api';

interface IRoleChangeButton {
  userId: number;
  roomId?: number;
  myRole: UserRole;
  userRole: UserRole;
  text: string;
}

export const RoleChangeButton = (props: IRoleChangeButton) => {
  const [role, setRole] = useState(props.userRole);
  const getRole: { [key: number]: string } = {
    0: '방장',
    1: '매니저',
    2: '일반',
  };

  const handleRoleChange = async () => {
    if (!props.roomId) return;
    const newRole = role === UserRole.MEMBER ? UserRole.MANAGER : UserRole.MEMBER;
    try {
      await roomApi.changeRole(props.roomId, props.userId, newRole.toString());
      setRole(newRole);
    } catch (error) {
      console.error('역할 변경 중 오류 발생:', error);
    }
  };

  return (
    <CommonButton
      color={ButtonColor.DARKGRAY}
      width="100%"
      height="40px"
      onClick={handleRoleChange}
      justifycontent="space-between"
      padding="10px"
      borderradius="10px"
    >
      <p>{props.text}</p>
      <p>{getRole[role]}</p>
    </CommonButton>
  );
};
