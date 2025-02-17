import { useState } from 'react';
import { CommonInput } from '@/components/common/Input';
import { UserFooter, VoiceChatFooter, ActionButton, JoinButton } from '../index.css';

import { SidebarType } from '@/types/enums/SidebarType';

import AddUserIcon from '@/assets/img/AddUser.svg';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';

interface IUserListFooter {
  sidebarType: SidebarType;
}

export const UserListFooter = (props: IUserListFooter) => {
  const [micOn, setMicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const handleMicrophone = () => setMicOn(!micOn);
  const handleSound = () => setSoundOn(!soundOn);

  if (props.sidebarType === SidebarType.USERLIST) {
    return (
      <UserFooter>
        <img src={AddUserIcon} alt="Add User" />
        <CommonInput placeholder="룸 유저 검색" design={1} />
      </UserFooter>
    );
  }

  if (props.sidebarType === SidebarType.VOICECHAT) {
    return (
      <VoiceChatFooter>
        <ActionButton onClick={handleMicrophone}>
          <img src={micOn ? MicrophoneOn : MicrophoneOffRed} />
        </ActionButton>
        <ActionButton onClick={handleSound}>
          <img src={soundOn ? HeadphoneOn : HeadphoneOffRed} />
        </ActionButton>
        <JoinButton>입장</JoinButton>
      </VoiceChatFooter>
    );
  }
  return null;
};
