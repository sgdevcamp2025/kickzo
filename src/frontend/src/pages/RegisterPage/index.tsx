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
import { userApi } from '@/api/endpoints/user/user.api';
import { RegisterSuccessModal } from '@/components/Modal/RegisterSuccessModal';

type CheckResult = {
  checked: boolean;
  isAvailable: boolean;
  message: string;
};

export const RegisterPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNicknameFilled, setIsNicknameFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [isPasswordCheckFilled, setIsPasswordCheckFilled] = useState(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);

  const [emailServerCheck, setEmailServerCheck] = useState<CheckResult>({
    checked: false,
    isAvailable: false,
    message: '',
  });

  const [nicknameServerCheck, setNicknameServerCheck] = useState<CheckResult>({
    checked: false,
    isAvailable: false,
    message: '',
  });

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isAgreed, setIsAgreed] = useState(false);
  const [onSuccessModal, setOnSuccessModal] = useState(false);

  const isFormValid = () => {
    return (
      isEmailValid &&
      emailServerCheck.isAvailable &&
      isNicknameFilled &&
      nicknameServerCheck.isAvailable &&
      isPasswordFilled &&
      isPasswordCheckFilled &&
      isPasswordMatched &&
      isPasswordValid &&
      isAgreed
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }

    try {
      const result = await userApi.register({
        email: emailRef.current?.value || '',
        password: passwordRef.current?.value || '',
        nickname: nicknameRef.current?.value || '',
      });
      if (result.userId) {
        setOnSuccessModal(true);
      }
    } catch (_error) {
      alert('회원가입에 실패했습니다.');
    }
  };

  const handleEmailCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value || '';

    if (isEmailValid && email) {
      const result = await userApi.checkEmailExists(email);
      console.log(result);
      setEmailServerCheck({
        checked: true,
        isAvailable: result.isAvailable,
        message: result.message,
      });
    }
  };

  const handleNicknameCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nickname = nicknameRef.current?.value || '';

    if (isNicknameFilled && nickname) {
      const result = await userApi.checkNicknameExists(nickname);
      console.log(result);
      setNicknameServerCheck({
        checked: true,
        isAvailable: result.isAvailable,
        message: result.message,
      });
    }
  };

  const handleEmailChange = () => {
    const email = emailRef.current?.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isFilled = email.trim() !== '';
    const isValid = emailRegex.test(email);

    setIsEmailValid(isFilled && isValid);
    setEmailServerCheck({
      checked: false,
      isAvailable: false,
      message: '',
    });
  };

  const handleNicknameChange = () => {
    const nickname = nicknameRef.current?.value || '';
    const isFilled = nickname.trim() !== '';

    setIsNicknameFilled(isFilled);
    setNicknameServerCheck({
      checked: false,
      isAvailable: false,
      message: '',
    });
  };

  const handlePasswordChange = () => {
    const password = passwordRef.current?.value || '';
    const isFilled = password.trim() !== '';
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    setIsPasswordFilled(isFilled);
    setIsPasswordValid(passwordRegex.test(password));
  };

  const handleConfirmPasswordChange = () => {
    const confirmPassword = confirmPasswordRef.current?.value || '';
    const isFilled = confirmPassword.trim() !== '';

    setIsPasswordCheckFilled(isFilled);
    setIsPasswordMatched(passwordRef.current?.value === confirmPassword);
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
          <WarningMessage
            $color={
              emailServerCheck.isAvailable
                ? 'var(--palette-status-positive)'
                : 'var(--palette-status-negative)'
            }
            $isVisible={emailServerCheck.checked}
          >
            {emailServerCheck.message}
          </WarningMessage>
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
          <WarningMessage
            $color={
              nicknameServerCheck.isAvailable
                ? 'var(--palette-status-positive)'
                : 'var(--palette-status-negative)'
            }
            $isVisible={nicknameServerCheck.checked}
          >
            {nicknameServerCheck.message}
          </WarningMessage>
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
            onChange={handlePasswordChange}
            required
          />
          <WarningMessage $isVisible={!isPasswordValid}>
            8-20자의 영문, 숫자, 특수문자(@$!%*?&) 포함
          </WarningMessage>
        </div>
        <div>
          <CommonLabel htmlFor="confirmPassword">비밀번호 재확인</CommonLabel>
          <CommonInput
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 다시 한번 입력해주세요."
            autoComplete="new-password"
            ref={confirmPasswordRef}
            $isValid={isPasswordMatched}
            onChange={handleConfirmPasswordChange}
            required
          />
          <WarningMessage $isVisible={!isPasswordMatched}>
            비밀번호가 서로 일치하지 않습니다.
          </WarningMessage>
        </div>
        <IdSaveCheckBox>
          <input type="checkbox" id="agreement" onChange={e => setIsAgreed(e.target.checked)} />
          <span>이용약관</span>과 <span>개인정보처리방침</span>에 동의합니다.
        </IdSaveCheckBox>
        <CommonButton
          color={ButtonColor.ORANGE}
          textcolor="var(--palette-static-white)"
          width="300px"
          height="3rem"
          borderradius="0.625rem"
          disabled={!isFormValid()}
        >
          가입하기
        </CommonButton>
      </form>
      {onSuccessModal && <RegisterSuccessModal onCancel={() => setOnSuccessModal(false)} />}
    </Wrapper>
  );
};
