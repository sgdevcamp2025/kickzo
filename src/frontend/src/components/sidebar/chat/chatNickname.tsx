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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Wrapper__Img = styled.img``;

const Wrapper__Nickname = styled.div<{ role: UserRole }>`
  color: ${({ role }) =>
    role === UserRole.OWNER ? '#FF9100' : role === UserRole.MANAGER ? '#4D94E1' : '#000000'};
  font-weight: bold;
`;
