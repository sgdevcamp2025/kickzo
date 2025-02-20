import { UserRole } from '../enums/UserRole';
import { SidebarType } from '../enums/SidebarType';

export interface ProfileDetailDto {
  userId: number;
  roomId?: number;
  userRole: UserRole;
  myRole: UserRole;
  sidebarType: SidebarType;
  nickname: string;
  introduce?: string;
  imgUrl: string;
}
