import React from 'react';
import { CommonButton } from '@/components/common/Button';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { Background, ButtonContainer, Detail, ModalContainer, Title } from './index.css';

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
