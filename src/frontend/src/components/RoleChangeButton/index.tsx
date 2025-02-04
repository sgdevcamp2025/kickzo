import { useState } from 'react';

import { CommonButton } from '@/components/common/Button';

import { ButtonColor } from '@/types/enums/ButtonColor';
import { UserRole } from '@/types/enums/UserRole';

interface IRoleChangeButton {
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

  return (
    <CommonButton
      color={ButtonColor.DARKGRAY}
      width="100%"
      height="40px"
      onClick={() => setRole(role === 2 ? 1 : 2)}
      justifycontent="space-between"
      padding="10px"
      borderradius="10px"
    >
      <p>{props.text}</p>
      <p>{getRole[role]}</p>
    </CommonButton>
  );
};
