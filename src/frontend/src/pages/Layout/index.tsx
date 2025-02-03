import { TopNavBar } from '@/components/TopNavBar';
import { LeftNavBar } from '@/components/LeftNavBar';
import { Outlet } from 'react-router-dom';
import { Wrapper, Container } from './index.css';

export const Layout = () => {
  return (
    <>
      <TopNavBar />
      <Wrapper>
        <LeftNavBar />
        <Container>
          <Outlet />
        </Container>
      </Wrapper>
    </>
  );
};
