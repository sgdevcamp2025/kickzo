import { keyframes, styled } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  padding: 1.5rem 0;
`;

export const SubTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  padding: 2rem 0 1rem;
`;

export const CommonParagraph = styled.p`
  font-size: 1rem;
`;

export const CommonUl = styled.ul`
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  background-color: var(--palette-static-white);
  border: 1px solid var(--palette-line-solid-alternative);
`;

export const CommonLi = styled.li<{ $hoverColor?: string }>`
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  transition: all 0.2s ease;

  &:hover {
    font-weight: 600;
    color: var(--palette-static-white);
    background-color: ${({ $hoverColor = 'var(--palette-line-solid-alternative)' }) => $hoverColor};
  }
`;

export const GreetingViewWrapper = styled(Wrapper)`
  min-height: 80vh;
  height: auto;
`;

export const GreetingViewContainer = styled(Container)`
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

export const GreetingViewImage = styled.div`
  max-width: 300px;
  width: 100%;
  margin-bottom: 1rem;
`;

export const GreetingViewTitle = styled(Title)`
  padding: 0;
`;

export const GreetingViewSubTitle = styled(SubTitle)`
  padding: 0;
  color: var(--palette-font-gray-strong);
  font-weight: 400;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

export const Copyright = styled.p`
  font-size: 0.875rem;
  color: var(--palette-font-gray);
  text-align: center;
  margin-top: 2rem;
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;
