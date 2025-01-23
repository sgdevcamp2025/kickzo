import { Link } from 'react-router-dom';
import AddCircleIcon from '@/assets/img/AddCircle.svg';
import BellIcon from '@/assets/img/Bell.svg';
import Logo from '@/assets/img/Logo.png';
import { Wrapper, ButtonContainer, ButtonBox, LogoBox, LoginButton } from './index.css';

export const TopNavBar = () => {
  return (
    <Wrapper>
      <Link to="/">
        <LogoBox>
          <img src={Logo} alt="Logo" />
        </LogoBox>
      </Link>
      <div>검색바</div>
      <ButtonContainer>
        <ButtonBox>
          <img src={AddCircleIcon} alt="Create Room" />
        </ButtonBox>
        <ButtonBox>
          <img src={BellIcon} alt="Notification" />
        </ButtonBox>
        <LoginButton>
          <Link to="/login">로그인</Link>
        </LoginButton>
      </ButtonContainer>
    </Wrapper>
  );
};
