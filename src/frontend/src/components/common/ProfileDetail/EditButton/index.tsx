import { Dispatch, SetStateAction } from 'react';
import { IconButton } from '@/components/IconButton';
import Edit from '@/assets/img/Edit.svg';
import Check from '@/assets/img/Check.svg';
import Setting from '@/assets/img/Setting.svg';
import Cancel from '@/assets/img/Cancel.svg';

interface IEditButton {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setNickname: Dispatch<SetStateAction<string>>;
  setIntroduce: Dispatch<SetStateAction<string>>;
}

export const EditButton = (props: IEditButton) => {
  const handleSave = () => {
    props.setIsEditing(false);
    alert('닉네임과 상태 메시지가 저장되었습니다.');
  };

  return (
    <>
      <IconButton
        beforeImgUrl={props.isEditing ? Check : Edit}
        afterImgUrl={props.isEditing ? Check : Edit}
        onClick={() => {
          if (props.isEditing) {
            handleSave();
          } else {
            props.setIsEditing(true);
          }
        }}
      />
      <IconButton
        beforeImgUrl={props.isEditing ? Cancel : Setting}
        afterImgUrl={props.isEditing ? Cancel : Setting}
        onClick={() => {
          if (props.isEditing) {
            props.setIsEditing(false);
            props.setNickname('이노');
            props.setIntroduce('저는 이제 집으로 갑니다');
          }
        }}
      />
    </>
  );
};
