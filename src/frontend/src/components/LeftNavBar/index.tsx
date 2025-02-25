import { Link, useLocation } from 'react-router-dom';
import HomeFillIcon from '@/assets/img/HomeFill.svg';
import HomeLineIcon from '@/assets/img/HomeLine.svg';
import PlaylistFillIcon from '@/assets/img/PlaylistFill.svg';
import PlaylistLineIcon from '@/assets/img/PlaylistLine.svg';
import UsersFillIcon from '@/assets/img/UsersFill.svg';
import UsersLineIcon from '@/assets/img/UsersLine.svg';
import { ButtonBox, ButtonContainer, ButtonWrapper } from './index.css';
import { NotificationCount } from '@/ui/Common.css';
import { useMyRoomsStore } from '@/stores/useMyRoomsStore';

export const LeftNavBar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMyRoom = location.pathname === '/my-room';
  const isFriend = location.pathname === '/friend';
  const newChatCount = useMyRoomsStore((state) => state.newChatCount);


  return (
    <ButtonContainer>
      <ButtonWrapper>
        <Link to="/">
          <ButtonBox $isActive={isHome}>
            <img src={isHome ? HomeFillIcon : HomeLineIcon} alt="Home" />
          </ButtonBox>
          <p>홈</p>
        </Link>
      </ButtonWrapper>
      <ButtonWrapper>
        <Link to="/my-room">
          <ButtonBox $isActive={isMyRoom}>
            <img src={isMyRoom ? PlaylistFillIcon : PlaylistLineIcon} alt="my Room" />
            {newChatCount > 0 && <NotificationCount>{newChatCount}</NotificationCount>}
          </ButtonBox>
          <p>MY</p>
        </Link>
      </ButtonWrapper>
      <ButtonWrapper>
        <Link to="/friend">
          <ButtonBox $isActive={isFriend}>
            <img src={isFriend ? UsersFillIcon : UsersLineIcon} alt="Friend" />
          </ButtonBox>
          <p>친구</p>
        </Link>
      </ButtonWrapper>
    </ButtonContainer>
  );
};
