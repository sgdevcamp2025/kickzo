import { Dispatch, SetStateAction } from 'react';
import { IconButton } from '@/components/IconButton';
import { EditButton } from '@/components/common/ProfileDetail/EditButton';
import { ProfileDetailType } from '@/types/enums/ProfileDetailType';

import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import AddUser from '@/assets/img/AddUser.svg';
import Check from '@/assets/img/Check.svg';

interface IRightButtonContainer {
  profileDetailType: ProfileDetailType;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setNickname: Dispatch<SetStateAction<string>>;
  setIntroduce: Dispatch<SetStateAction<string>>;
}

export const RightButtonContainer = ({
  profileDetailType,
  isEditing,
  setIsEditing,
  setNickname,
  setIntroduce,
}: IRightButtonContainer) => {
  if (profileDetailType === ProfileDetailType.VOICECHAT) {
    return (
      <>
        <IconButton beforeImgUrl={MicrophoneOn} afterImgUrl={MicrophoneOffRed} />
        <IconButton beforeImgUrl={HeadphoneOn} afterImgUrl={HeadphoneOffRed} />
      </>
    );
  }

  if (profileDetailType === ProfileDetailType.EDIT) {
    return (
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setNickname={setNickname}
        setIntroduce={setIntroduce}
      />
    );
  }

  return <IconButton beforeImgUrl={AddUser} afterImgUrl={Check} />;
};
