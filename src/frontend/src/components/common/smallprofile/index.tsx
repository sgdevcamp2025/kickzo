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

enum UserRole {
  OWNER = 0,
  MANAGER = 1,
  USER = 2,
}
enum profileType {
  INVITE = 0,
  VOICECHAT = 1,
  MEMBER = 2,
}

interface ISmallProfile {
  type: profileType;
  role: UserRole;
  nickname: string;
  imgUrl: string;
}

export const SmallProfile = (props: ISmallProfile) => {
  const renderBtn = () => {
    if (props.type === profileType.INVITE) {
      return <button>초대</button>;
    } else if (props.type === profileType.VOICECHAT) {
      return (
        <ImgWrapper>
          <ImgWrapper_Img src={MicrophoneOffRed} />
          <ImgWrapper_Img src={HeadphoneOffRed} />
        </ImgWrapper>
      );
    }
    // else if(props.type === profileType.MEMBER){
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
