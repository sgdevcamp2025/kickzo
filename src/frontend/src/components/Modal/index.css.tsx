import { styled } from 'styled-components';

export const Background = styled.div<{ $hasBackground?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: default;
  background: ${({ $hasBackground = true }) =>
    $hasBackground ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
  animation: fadeInBg 0.5s;
  @keyframes fadeInBg {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  z-index: 999;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--palette-static-white);
  z-index: 1000;
  cursor: default;
  box-shadow: var(--palette-elevation-shadow-heavy);
  animation: fadeInModal 0.5s;
  @keyframes fadeInModal {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1.5;
    }
  }
`;

export const RelativeModalContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 300px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 20px 0px 20px;
  background: var(--palette-static-white);
  z-index: 1000;
  cursor: default;
  box-shadow: var(--palette-elevation-shadow-heavy);
  animation: fadeInModal 0.5s;
  @keyframes fadeInModal {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1.5;
    }
  }
`;

export const Title = styled.h2`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;

  & > img {
    margin-right: 10px;
  }
`;

export const Detail = styled.p`
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.4;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 40px;
  gap: 10px;
`;
