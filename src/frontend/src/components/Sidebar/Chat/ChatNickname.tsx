import styled from 'styled-components';
import RoleOwner from '@/assets/img/RoleOwner.svg';
import RoleManager from '@/assets/img/RoleManager.svg';
import { UserRole } from '@/types/enums/UserRole';

interface IChatNickname {
  role: UserRole;
  nickname: string;
}

export const ChatNickname = (props: IChatNickname) => {
  return (
    <Wrapper>
      {props.role !== UserRole.USER ? (
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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Img = styled.img``;

const Nickname = styled.div<{ $role: UserRole }>`
  color: ${({ $role }) =>
    $role === UserRole.OWNER ? '#FF9100' : $role === UserRole.MANAGER ? '#4D94E1' : '#000000'};
  font-weight: bold;
`;
