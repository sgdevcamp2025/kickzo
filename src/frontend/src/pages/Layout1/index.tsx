import { TopNavBar } from '@/components/TopNavBar1';
import { LeftNavBar } from '@/components/LeftNavBar1';
import { Link, Outlet } from 'react-router-dom';
import { Wrapper, Container, LinkContainer } from './index.css';

export const Layout = () => {
  return (
    <>
      <TopNavBar />
      <Wrapper>
        <LeftNavBar />
        {/* 삭제할 Link 입니다 */}
        <Container>
          <LinkContainer style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Link to="/setting">설정</Link>
            <Link to="/register">회원가입</Link>
            <Link to="/room">방</Link>
          </LinkContainer>
          <Outlet />
        </Container>
      </Wrapper>
    </>
  );
};
