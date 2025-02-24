import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/Button';
import { LogoButton } from '@/components/common/LogoButton';
import { Wrapper, CommonInput, IdSaveCheckBox, LinkBox, SubTitle } from './index.css';
import { useAuth } from '@/hooks/queries/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useLocalStorage } from '@/hooks/utils/useLocalStorage';
import { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/errorUtils';

export const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const [isSaveEmail, setIsSaveEmail] = useLocalStorage<boolean>('isSaveEmail', false);
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('savedEmail', '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
      if (isSaveEmail) {
        const encodedEmail = btoa(email);
        setSavedEmail(encodedEmail);
        setIsSaveEmail(true);
      } else {
        setSavedEmail('');
        setIsSaveEmail(false);
      }

      login.mutate(
        { email, password },
        {
          onError: (error: Error) => {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
              alert('이메일 또는 비밀번호가 일치하지 않습니다.');
            } else if (axiosError.response?.status === 429) {
              alert('너무 많은 요청을 보내셨습니다. 잠시 후 다시 시도해주세요.');
            } else {
              alert(getErrorMessage(axiosError));
            }
          },
        },
      );
    } else {
      alert('이메일과 비밀번호를 입력해주세요.');
    }
  };

  const loadSavedEmail = () => {
    if (!savedEmail) return '';

    try {
      return atob(savedEmail);
    } catch {
      setSavedEmail('');
      return '';
    }
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
          defaultValue={loadSavedEmail()}
        />
        <CommonInput
          type="password"
          placeholder="비밀번호"
          ref={passwordRef}
          autoComplete="new-password"
          required
        />
        <IdSaveCheckBox>
          <input
            type="checkbox"
            checked={isSaveEmail}
            onChange={e => setIsSaveEmail(e.target.checked)}
          />
          아이디 저장
        </IdSaveCheckBox>
        <CommonButton
          color={ButtonColor.ORANGE}
          width="300px"
          height="3rem"
          borderradius="0.625rem"
          disabled={login.isPending}
        >
          {login.isPending ? <LoadingSpinner /> : '로그인'}
        </CommonButton>
        <LinkBox>
          <Link to="/register">회원가입</Link>
          <Link to="/password-reset">비밀번호 재설정</Link>
        </LinkBox>
      </form>
    </Wrapper>
  );
};
