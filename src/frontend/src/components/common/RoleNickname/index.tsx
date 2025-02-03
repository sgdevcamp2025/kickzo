import RoleOwner from '@/assets/img/RoleOwner.svg';
import RoleManager from '@/assets/img/RoleManager.svg';
import { Wrapper, Img, Nickname } from './index.css';
import { UserRole } from '@/types/enums/UserRole';

interface IRoleNickname {
  role: UserRole;
  nickname: string;
}

export const RoleNickname = (props: IRoleNickname) => {
  return (
    <Wrapper>
      {props.role !== UserRole.MEMBER ? (
        <Img
          src={
            props.role === UserRole.OWNER
              ? RoleOwner
              : props.role === UserRole.MANAGER
                ? RoleManager
                : ''
          }
          alt="User Role"
        />
      ) : (
        ''
      )}

      <Nickname $role={props.role}>{props.nickname}</Nickname>
    </Wrapper>
  );
};
