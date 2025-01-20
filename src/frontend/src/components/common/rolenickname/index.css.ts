import styled from 'styled-components';
import { UserRole } from '@/types/enums/UserRole';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Wrapper__Img = styled.img`
  width: 25px;
  height: 25px;
`;

export const Wrapper__Nickname = styled.div<{ role: UserRole }>`
  color: ${({ role }) =>
    role === UserRole.OWNER ? '#FF9100' : role === UserRole.MANAGER ? '#4D94E1' : '#000000'};
  font-weight: bold;
`;
