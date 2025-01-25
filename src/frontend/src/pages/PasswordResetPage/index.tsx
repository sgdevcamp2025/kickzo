import { useRef, useState } from 'react';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/button';
import { LogoButton } from '@/components/common/LogoButton';
import { CommonInput, CommonLabel, SubTitle, Title, TitleBox, Wrapper } from './index.css';

export const PasswordResetPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    console.log('Email:', emailRef.current?.value);
    console.log('Password:', passwordRef.current?.value);
  };

  const handleEmailChange = () => {
    const email = emailRef.current?.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isFilled = email.trim() !== '';
    const isValid = emailRegex.test(email);

    setIsEmailValid(isFilled && isValid);
  };

  return (
    <Wrapper>
      <LogoButton />
      <TitleBox>
        <Title>비밀번호 재설정</Title>
        <SubTitle>비밀번호 재설정을 위해 이메일 입력이 필요해요.</SubTitle>
      </TitleBox>
      <form onSubmit={handleSubmit}>
        <div>
          <CommonLabel htmlFor="email">이메일</CommonLabel>
          <CommonInput
            type="text"
            placeholder="이메일을 입력해주세요."
            autoComplete="new-password"
            ref={emailRef}
            onChange={handleEmailChange}
            required
          />
        </div>
        <CommonButton
          color={ButtonColor.ORANGE}
          width="300px"
          height="3rem"
          borderradius="0.625rem"
          disabled={!isEmailValid}
        >
          이메일 보내기
        </CommonButton>
      </form>
    </Wrapper>
  );
};
