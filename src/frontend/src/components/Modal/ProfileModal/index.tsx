import { ProfileDetail } from '@/components/common/ProfileDetail';
import { Background, ModalContainer } from '../index.css';
import { SidebarType } from '@/types/enums/SidebarType';
import { UserRole } from '@/types/enums/UserRole';
interface IProfileModal {
  userId: number;
  onCancel: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ProfileModal = ({ userId, onCancel }: IProfileModal) => {
  return (
    <>
      <Background $hasBackground={false} onClick={onCancel} />
      <ModalContainer>
        <ProfileDetail
          userId={userId}
          userRole={UserRole.NONE}
          myRole={UserRole.NONE}
          sidebarType={SidebarType.USERLIST}
          nickname={''}
          introduce={''}
          imgUrl={''}
        />
      </ModalContainer>
    </>
  );
};
