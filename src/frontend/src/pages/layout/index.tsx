import { TopNavBar } from '@/components/topNavBar';
import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <TopNavBar />
      {/* 삭제할 Link 입니다 */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Link to="/">Home</Link>
        <Link to="/friend">Friend</Link>
        <Link to="/setting">설정</Link>
        <Link to="/register">회원가입</Link>
        <Link to="/room">방</Link>
      </div>
      <Outlet />
    </>
  );
};
