import { Modal } from '@/components/Modal';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { ModalPortal } from '@/components/Modal/ModalPortal';
import { IModal } from '@/components/Modal';
import { useNavigate } from 'react-router-dom';

interface IRegisterSuccessModal {
  onCancel: () => void;
}

export const RegisterSuccessModal = ({ onCancel }: IRegisterSuccessModal) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/login');
    onCancel();
  };

  const props: IModal = {
    title: '회원가입 완료',
    detail: '회원가입이 완료되었습니다.',
    confirmText: '로그인 하기',
    confirmButtonColor: ButtonColor.ORANGE,
    onConfirm: handleConfirm,
    onCancel: handleConfirm,
  };

  return (
    <ModalPortal>
      <Modal {...props} />
    </ModalPortal>
  );
};
