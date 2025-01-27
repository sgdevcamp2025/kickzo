import { useRef, useState } from 'react';
import { LogoButton } from '@/components/common/LogoButton';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/Button';
import {
  CommonInput,
  CommonLabel,
  IdSaveCheckBox,
  InputBox,
  SubTitle,
  WarningMessage,
  Wrapper,
} from './index.css';

export const RegisterPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordCheckRef = useRef<HTMLInputElement>(null);

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNicknameFilled, setIsNicknameFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [isPasswordCheckFilled, setIsPasswordCheckFilled] = useState(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    console.log('Email:', emailRef.current?.value);
    console.log('Password:', passwordRef.current?.value);
    console.log('Password:', passwordCheckRef.current?.value);
  };

  const handleEmailCheck = () => {
    console.log('email check:', emailRef.current?.value);
  };

  const handleNicknameCheck = () => {
    console.log('nickname check:', nicknameRef.current?.value);
  };

  const handleEmailChange = () => {
    const email = emailRef.current?.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isFilled = email.trim() !== '';
    const isValid = emailRegex.test(email);

    setIsEmailValid(isFilled && isValid);
  };

  const handleNicknameChange = () => {
    const nickname = nicknameRef.current?.value || '';
    const isFilled = nickname.trim() !== '';

    setIsNicknameFilled(isFilled);
  };

  const handlePassword = () => {
    const password = passwordRef.current?.value || '';
    const isFilled = password.trim() !== '';

    setIsPasswordFilled(isFilled);
  };

  const handlePasswordCheck = () => {
    const passwordCheck = passwordCheckRef.current?.value || '';
    const isFilled = passwordCheck.trim() !== '';

    setIsPasswordCheckFilled(isFilled);
    setIsPasswordMatched(passwordRef.current?.value === passwordCheck);
  };

  return (
    <Wrapper>
      <LogoButton />
      <SubTitle>회원가입 후 킥튜브를 즐겨보세요 :)</SubTitle>
      <form onSubmit={handleSubmit}>
        <div>
          <CommonLabel htmlFor="email">이메일</CommonLabel>
          <InputBox>
            <input
              id="email"
              type="text"
              placeholder="이메일"
              ref={emailRef}
              onChange={handleEmailChange}
              required
            />
            <button onClick={handleEmailCheck} disabled={!isEmailValid}>
              중복 확인
            </button>
          </InputBox>
        </div>
        <div>
          <CommonLabel htmlFor="nickname">닉네임</CommonLabel>
          <InputBox>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임"
              autoComplete="username"
              ref={nicknameRef}
              onChange={handleNicknameChange}
              required
            />
            <button onClick={handleNicknameCheck} disabled={!isNicknameFilled}>
              중복 확인
            </button>
          </InputBox>
        </div>
        <div>
          <CommonLabel htmlFor="password">비밀번호</CommonLabel>
          <CommonInput
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            autoComplete="new-password"
            ref={passwordRef}
            $isValid={isPasswordMatched}
            onChange={handlePassword}
            required
          />
        </div>
        <div>
          <CommonLabel htmlFor="passwordCheck">비밀번호 재확인</CommonLabel>
          <CommonInput
            id="passwordCheck"
            type="password"
            placeholder="비밀번호 다시 한번 입력해주세요."
            autoComplete="new-password"
            ref={passwordCheckRef}
            $isValid={isPasswordMatched}
            onChange={handlePasswordCheck}
            required
          />
          <WarningMessage $isVisible={!isPasswordMatched}>
            비밀번호가 서로 일치하지 않습니다.
          </WarningMessage>
        </div>
        <IdSaveCheckBox>
          <input type="checkbox" />
          <span>이용약관</span>과 <span>개인정보처리방침</span>에 동의합니다.
        </IdSaveCheckBox>
        <CommonButton
          color={ButtonColor.ORANGE}
          textcolor="var(--palette-static-white)"
          width="300px"
          height="3rem"
          borderradius="0.625rem"
          disabled={
            !(
              isEmailValid &&
              isNicknameFilled &&
              isPasswordFilled &&
              isPasswordCheckFilled &&
              isPasswordMatched
            )
          }
        >
          가입하기
        </CommonButton>
      </form>
    </Wrapper>
  );
};
