import RoleOwner from '@/assets/img/RoleOwner.svg';
import RoleManager from '@/assets/img/RoleManager.svg';
import { Wrapper, Wrapper__Img, Wrapper__Nickname } from './index.css';
import { UserRole } from '@/types/enums/UserRole';

interface IRoleNickname {
  role: UserRole;
  nickname: string;
}

export const RoleNickname = (props: IRoleNickname) => {
  return (
    <Wrapper>
      {props.role !== UserRole.USER ? (
        <Wrapper__Img
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

      <Wrapper__Nickname role={props.role}>{props.nickname}</Wrapper__Nickname>
    </Wrapper>
  );
};
