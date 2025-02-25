import { Background, RelativeModalContainer } from '../index.css';
import { ProfileDetail } from '@/components/common/ProfileDetail';
import { SidebarType } from '@/types/enums/SidebarType';
import { styled } from 'styled-components';

interface IProfileModal {
  userId: number;
  roomId: number;
  nickname: string;
  imgUrl: string;
  userRole: number;
  myRole: number;
  sidebarType: SidebarType;
  onCancel: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const RoomProfileModal = (props: IProfileModal) => {
  return (
    <>
      <Background $hasBackground={false} onClick={props.onCancel} />
      <Container>
        <ProfileDetail
          userId={props.userId}
          roomId={props.roomId}
          nickname={props.nickname}
          imgUrl={props.imgUrl}
          userRole={props.userRole}
          myRole={props.myRole}
          sidebarType={props.sidebarType}
        />
      </Container>
    </>
  );
};

const Container = styled(RelativeModalContainer)`
  width: 260px;
  left: 10px;
  top: 50px;
  z-index: 1000;
`;
