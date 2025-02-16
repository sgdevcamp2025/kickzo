import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '@/assets/img/Logo.svg'; // 로고 경로는 프로젝트에 맞게 수정
import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const LogoImg = styled.img`
  width: 150px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  margin-bottom: 3rem;
  color: var(--palette-font-gray);
`;

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LogoImg src={Logo} alt="Logo" />
      <Title>원하시는 페이지를 찾을 수 없습니다.</Title>
      <Message>요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.</Message>
      <CommonButton
        onClick={() => navigate('/')}
        width="160px"
        height="40px"
        color={ButtonColor.ORANGE}
      >
        홈으로 가기
      </CommonButton>
    </Container>
  );
};
