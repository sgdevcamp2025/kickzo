import { UserRole } from '../enums/UserRole';
import { SidebarType } from '../enums/SidebarType';

export interface ProfileDetailDto {
  userId: number;
  userRole: UserRole;
  myRole: UserRole;
  sidebarType: SidebarType;
}
