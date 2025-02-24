import styled from 'styled-components';
import { UserRole } from '@/types/enums/UserRole';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const Img = styled.div`
  width: 16px;
  height: 16px;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

export const Nickname = styled.div<{ $role: UserRole }>`
  color: ${({ $role }) =>
    $role === UserRole.CREATOR ? '#FF9100' : $role === UserRole.MANAGER ? '#4D94E1' : '#000000'};
  font-weight: 500;
`;
