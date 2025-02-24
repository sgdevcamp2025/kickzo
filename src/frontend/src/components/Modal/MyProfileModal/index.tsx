import { MyProfile } from '@/components/Profile/MyProfile';
import { Background, RelativeModalContainer } from '../index.css';

interface IProfileModal {
  onCancel: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ProfileModal = ({ onCancel }: IProfileModal) => {
  return (
    <>
      <Background $hasBackground={false} onClick={onCancel} />
      <RelativeModalContainer>
        <MyProfile />
      </RelativeModalContainer>
    </>
  );
};
