import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { LogoButton } from '@/components/common/LogoButton';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/button';

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

  & > form > div {
    margin-bottom: 0.75rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.125rem;
  margin: 1.875rem 0;
`;

const CommonLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const InputBox = styled.div`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--palette-line-normal-normal);

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }

  & > input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 1rem;
  }

  & > button {
    min-width: 70px;
    height: 100%;
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 2px 6px;
    cursor: pointer;
    background-color: transparent;
    color: var(--palette-primary-normal);
    &:disabled {
      color: var(--palette-label-disable);
    }
  }
`;

const CommonInput = styled.input<{ $isValid?: boolean }>`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 0.625rem;
  border: ${({ $isValid = true }) =>
    $isValid
      ? '1px solid var(--palette-line-normal-normal)'
      : '1px solid var(--palette-status-negative)'};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;

const IdSaveCheckBox = styled.label`
  margin: 10px 0 40px;
  display: flex;
  gap: 4px;
  cursor: pointer;

  & > span {
    font-weight: 600;
    text-decoration: underline;
  }
`;

const WarningMessage = styled.p<{ $isVisible: boolean }>`
  font-size: 0.75rem;
  color: var(--palette-status-negative);
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`;
