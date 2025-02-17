import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/img/Logo.svg';
import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { Container, LogoImg, Title, Message } from './index.css';

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
