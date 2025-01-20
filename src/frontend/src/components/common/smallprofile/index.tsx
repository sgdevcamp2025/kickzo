import { RoleNickname } from '../rolenickname';
import {
  Container,
  Container__Profile,
  Container__Profile__Img,
  ImgWrapper,
  ImgWrapper_Img,
} from './index.css';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import { UserRole } from '@/types/enums/UserRole';
import { ProfileType } from '@/types/enums/ProfileType';

interface ISmallProfile {
  type: ProfileType;
  role: UserRole;
  nickname: string;
  imgUrl: string;
}

export const SmallProfile = (props: ISmallProfile) => {
  const renderBtn = () => {
    if (props.type === ProfileType.INVITE) {
      return <button>초대</button>;
    } else if (props.type === ProfileType.VOICECHAT) {
      return (
        <ImgWrapper>
          <ImgWrapper_Img src={MicrophoneOffRed} />
          <ImgWrapper_Img src={HeadphoneOffRed} />
        </ImgWrapper>
      );
    }
    // else if(props.type === ProfileType.MEMBER){
    //     return();
    // }
    return null;
  };
  return (
    <Container>
      <Container__Profile>
        <Container__Profile__Img src={props.imgUrl} />
        <RoleNickname role={props.role} nickname={props.nickname} />
      </Container__Profile>
      {renderBtn()}
    </Container>
  );
};
