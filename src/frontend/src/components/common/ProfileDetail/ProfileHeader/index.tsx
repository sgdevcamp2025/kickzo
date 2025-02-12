import { IconButton } from '@/components/IconButton';
import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import AddUser from '@/assets/img/AddUser.svg';
import Check from '@/assets/img/Check.svg';
import { SidebarType } from '@/types/enums/SidebarType';
import {
  Profile__Header,
  Profile__Header__Img,
  Profile__Header__ButtonContainer,
} from '../index.css';

interface IProfileHeader {
  sidebarType: SidebarType;
  imgUrl: string;
}

export const ProfileHeader = (props: IProfileHeader) => {
  return (
    <Profile__Header>
      <Profile__Header__Img src={props.imgUrl} />
      <Profile__Header__ButtonContainer>
        {props.sidebarType === SidebarType.VOICECHAT ? (
          <>
            <IconButton beforeImgUrl={MicrophoneOn} afterImgUrl={MicrophoneOffRed} />
            <IconButton beforeImgUrl={HeadphoneOn} afterImgUrl={HeadphoneOffRed} />
          </>
        ) : (
          <IconButton beforeImgUrl={AddUser} afterImgUrl={Check} />
        )}
      </Profile__Header__ButtonContainer>
    </Profile__Header>
  );
};
