import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/button';
import { LogoButton } from '@/components/common/LogoButton';
import { Wrapper, CommonInput, IdSaveCheckBox, LinkBox, SubTitle } from './index.css';

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
      <LogoButton />
      <SubTitle>로그인 후 킥튜브를 즐겨보세요 :)</SubTitle>
      <form onSubmit={handleSubmit}>
        <CommonInput
          type="text"
          placeholder="이메일"
          ref={emailRef}
          autoComplete="new-password"
          required
        />
        <CommonInput
          type="password"
          placeholder="비밀번호"
          ref={passwordRef}
          autoComplete="new-password"
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
