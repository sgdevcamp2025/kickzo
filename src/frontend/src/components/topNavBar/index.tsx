import { Link } from 'react-router-dom';
import AddCircleIcon from '@/assets/img/AddCircle.svg';
import BellIcon from '@/assets/img/Bell.svg';
import Logo from '@/assets/img/Logo.png';
import { ButtonBox, ButtonWrapper, Container, LoginButton, LogoBox } from './index.css';

export const TopNavBar = () => {
  return (
    <Container>
      <Link to="/">
        <LogoBox>
          <img src={Logo} alt="Logo" />
        </LogoBox>
      </Link>
      <div>검색바</div>
      <ButtonWrapper>
        <ButtonBox>
          <img src={AddCircleIcon} alt="Create Room" />
        </ButtonBox>
        <ButtonBox>
          <img src={BellIcon} alt="Notification" />
        </ButtonBox>
        <LoginButton>
          <Link to="/login">로그인</Link>
        </LoginButton>
      </ButtonWrapper>
    </Container>
  );
};
