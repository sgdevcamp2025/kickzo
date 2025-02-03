import { Modal } from '@/components/Modal';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { ModalPortal } from '@/components/Modal/ModalPortal';
import { IModal } from '@/components/Modal';

interface IRoomDeleteModal {
  onCancel: () => void;
}

export const RoomDeleteModal = ({ onCancel }: IRoomDeleteModal) => {
  const handleDelete = () => {
    console.log('삭제');
    onCancel();
  };

  const props: IModal = {
    title: '방 삭제',
    detail: `삭제 시 되돌릴 수 없습니다.\n정말 삭제하시겠습니까?`,
    confirmText: '삭제',
    confirmButtonColor: ButtonColor.RED,
    onConfirm: handleDelete,
    cancelText: '취소',
    cancelButtonColor: ButtonColor.TRANSPARENT,
    onCancel: onCancel,
  };

  return (
    <ModalPortal>
      <Modal {...props} />
    </ModalPortal>
  );
};
