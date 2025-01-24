import { useRef } from 'react';
import { styled } from 'styled-components';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { CommonButton } from '@/components/common/button';
import { LogoButton } from '@/components/common/LogoButton';

export const PasswordResetPage = () => {
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
            required
          />
        </div>
        <CommonButton
          color={ButtonColor.ORANGE}
          width="300px"
          height="3rem"
          borderradius="0.625rem"
        >
          이메일 보내기
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
  gap: 20px;

  & > form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const TitleBox = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const SubTitle = styled.p`
  font-size: 1.125rem;
  color: var(--palette-interaction-inactive);
`;

const CommonLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CommonInput = styled.input`
  display: block;
  width: 300px;
  height: 3rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--palette-line-normal-normal);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus-within {
    border: 1px solid var(--palette-interaction-inactive);
  }
`;
