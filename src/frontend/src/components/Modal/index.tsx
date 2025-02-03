import React from 'react';
import { styled } from 'styled-components';
import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';

export interface IModal {
  title?: string;
  detail?: string;
  confirmText?: string;
  confirmButtonColor?: ButtonColor;
  onConfirm?: () => void;
  cancelText?: string;
  cancelButtonColor?: ButtonColor;
  onCancel?: () => void;
}

export const Modal = (props: IModal) => {
  return (
    <>
      <Background onClick={props.onCancel} />
      <ModalContainer>
        {props.title && <Title>{props.title}</Title>}
        {props.detail && (
          <Detail>
            {props.detail.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Detail>
        )}
        <ButtonContainer>
          {props.confirmText && (
            <CommonButton
              color={props.confirmButtonColor}
              borderradius="10px"
              padding="10px"
              onClick={props.onConfirm}
            >
              {props.confirmText}
            </CommonButton>
          )}
          {props.cancelText && (
            <CommonButton
              color={props.cancelButtonColor}
              textcolor="black"
              border="1px solid var(--palette-line-normal-normal)"
              borderradius="10px"
              padding="10px"
              onClick={props.onCancel}
            >
              {props.cancelText}
            </CommonButton>
          )}
        </ButtonContainer>
      </ModalContainer>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeInBg 0.5s;
  @keyframes fadeInBg {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  z-index: 1000;
`;

const ModalContainer = styled.div`
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

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  width: 100%;
`;

const Detail = styled.p`
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 40px;
  gap: 10px;
`;
