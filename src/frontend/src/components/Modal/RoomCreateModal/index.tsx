import { ButtonColor } from '@/types/enums/ButtonColor';
import { ModalPortal } from '@/components/Modal/ModalPortal';
import { IModal } from '@/components/Modal';
import { Background, ButtonContainer, ModalContainer, Title } from '@/components/Modal/index.css';
import { CommonInput, PrivacyButton, PrivacyToggleContainer } from './index.css';
import { CommonButton } from '@/components/common/Button';
import { useRef, useState } from 'react';
import VideoIcon from '@/assets/img/Video.svg';
import UserLineIcon from '@/assets/img/UsersLine.svg';
import UserLineWhiteIcon from '@/assets/img/UsersLine_W.svg';
import DisableEyeIcon from '@/assets/img/DisableEye.svg';
import DisableEyeWhiteIcon from '@/assets/img/DisableEye_W.svg';

interface IRoomCreateModal {
  onCancel: () => void;
}

export const RoomCreateModal = ({ onCancel }: IRoomCreateModal) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(true);

  const handleTitleChange = () => {
    console.log('title:', titleRef.current?.value);
  };

  const handleCreation = () => {
    console.log('생성');
    onCancel();
  };

  const props: IModal = {
    title: '방 만들기',
    confirmText: '생성',
    confirmButtonColor: ButtonColor.ORANGE,
    onConfirm: handleCreation,
    cancelText: '취소',
    cancelButtonColor: ButtonColor.TRANSPARENT,
    onCancel: onCancel,
  };

  return (
    <ModalPortal>
      <Background onClick={props.onCancel} />
      <ModalContainer>
        <Title>
          <img src={VideoIcon} alt="" />방 만들기
        </Title>
        <CommonInput
          type="text"
          placeholder="방 제목"
          ref={titleRef}
          onChange={handleTitleChange}
          required
        />
        <PrivacyToggleContainer>
          <PrivacyButton $active={isPublic} onClick={() => setIsPublic(true)}>
            {isPublic ? (
              <img src={UserLineWhiteIcon} alt="Users Icon" />
            ) : (
              <img src={UserLineIcon} alt="Users Icon" />
            )}
            공개
          </PrivacyButton>
          <PrivacyButton $active={!isPublic} onClick={() => setIsPublic(false)}>
            {isPublic ? (
              <img src={DisableEyeIcon} alt="Disable Eye" />
            ) : (
              <img src={DisableEyeWhiteIcon} alt="Disable Eye" />
            )}
            비공개
          </PrivacyButton>
        </PrivacyToggleContainer>
        <ButtonContainer>
          <CommonButton
            color={props.confirmButtonColor}
            borderradius="10px"
            padding="10px"
            onClick={props.onConfirm}
          >
            {props.confirmText}
          </CommonButton>
          <CommonButton
            color={props.cancelButtonColor}
            textcolor="var(--palette-primary)"
            border="1px solid var(--palette-line-normal-normal)"
            borderradius="10px"
            padding="10px"
            onClick={props.onCancel}
          >
            {props.cancelText}
          </CommonButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalPortal>
  );
};
