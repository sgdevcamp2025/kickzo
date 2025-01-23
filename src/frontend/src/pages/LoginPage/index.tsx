import { styled } from 'styled-components';
import Logo from '@/assets/img/Logo.png';
import { Link } from 'react-router-dom';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/button';
import { useRef } from 'react';

export const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    console.log('Email:', emailRef.current?.value);
    console.log('Password:', passwordRef.current?.value);
  };

  return (
    <Wrapper>
      <Link to="/">
        <img src={Logo} alt="Logo" />
      </Link>
      <SubTitle>로그인 후 킥튜브를 즐겨보세요 :)</SubTitle>
      <form onSubmit={handleSubmit}>
        <CommonInput
          type="text"
          placeholder="아이디"
          // onChange={e => setEmail(e.target.value)}
          ref={emailRef}
          required
        />
        <CommonInput
          type="password"
          placeholder="비밀번호"
          // onChange={e => setPassword(e.target.value)}
          ref={passwordRef}
          required
        />
        <IdSaveCheckBox>
          <input type="checkbox" />
          아이디 저장
        </IdSaveCheckBox>
        <CommonButton
          color={ButtonColor.ORANGE}
          width="300px"
          height="3rem"
          borderradius="0.625rem"
        >
          로그인
        </CommonButton>

        <LinkBox>
          <Link to="/register">회원가입</Link>
          <Link to="/password-reset">비밀번호 재설정</Link>
        </LinkBox>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const SubTitle = styled.p`
  font-size: 1.125rem;
  margin: 1.875rem 0;
`;

const CommonInput = styled.input`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  border: 1px solid var(--palette-interaction-inactive);
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const IdSaveCheckBox = styled.label`
  margin: 10px 0 30px;
  display: flex;
  gap: 4px;
  cursor: pointer;
`;

const LinkBox = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 2rem;

  & > a {
    position: relative;
    cursor: pointer;
    font-size: 0.875rem;
  }

  & > a:first-child::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 0.75rem;
    background-color: var(--palette-line-normal-normal);
  }
`;
