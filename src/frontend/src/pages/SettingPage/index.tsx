import { Wrapper, Container, Title, CommonUl, CommonLi, Copyright } from '@/ui/Common.css';
import { useAuth } from '@/hooks/queries/useAuth';

export const SettingPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <Wrapper>
      <Container>
        <Title>설정</Title>
        <CommonUl>
          <CommonLi onClick={handleLogout} $hoverColor="var(--palette-status-negative)">
            로그아웃
          </CommonLi>
        </CommonUl>
        <Copyright>&copy; 2025. KICKZO. All rights reserved.</Copyright>
      </Container>
    </Wrapper>
  );
};
