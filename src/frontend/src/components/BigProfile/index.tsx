import {
  Container,
  Profile,
  Profile__Header,
  Profile__Header__Img,
  Profile__Header__ButtonContainer,
  Profile__Nickname,
  ButtonContainer,
} from './index.css';
import { UserRole } from '@/types/enums/UserRole';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { SidebarType } from '@/types/enums/SidebarType';
import { RoleChangeButton } from '@/components/RoleChangeButton';
import { CommonButton } from '@/components/Common/Button';
import { IconButton } from '@/components/IconButton';

import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import AddUser from '@/assets/img/AddUser.svg';
import Check from '@/assets/img/Check.svg';

interface IBigProfile {
  userId: string;
  userRole: UserRole;
  myRole: UserRole;
  sidebarType: SidebarType;
}

const detailProfile = {
  imgUrl:
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MjVfMTQ5%2FMDAxNTk1Njc4MzEyNzA4.knqIC64twrLoZDviHrAUSrEbgtxNp8h4nGsT-4mrWgkg.VImfsqV3F5GqyCPCIN4Xfid4TpUXQkljevfhuX_HK4gg.JPEG.haha9558%2FIMG_0114.JPG&type=a340',
  nickname: '이노',
  introduce: '저는 이제 집으로 갑니다',
};
export const BigProfile = (props: IBigProfile) => {
  const renderBtnContainer = () => {
    if (props.myRole === UserRole.OWNER && props.sidebarType === SidebarType.VoiceChat) {
      return (
        <>
          <RoleChangeButton
            myRole={props.myRole}
            userRole={props.userRole}
            text="권한"
          ></RoleChangeButton>
          <CommonButton
            color={ButtonColor.RED}
            onClick={() => {
              alert('방장에 의해 연결이 끊겼습니다.');
            }}
            justifycontent="left"
            width="100%"
            height="40px"
            padding="10px"
            borderradius="10px"
          >
            연결 끊기
          </CommonButton>
          <CommonButton
            color={ButtonColor.RED}
            onClick={() => {
              alert('추방되었습니다.');
            }}
            justifycontent="left"
            width="100%"
            height="40px"
            padding="10px"
            borderradius="10px"
          >
            추방하기
          </CommonButton>
        </>
      );
    }
    if (props.myRole === UserRole.OWNER) {
      return (
        <>
          <RoleChangeButton
            myRole={props.myRole}
            userRole={props.userRole}
            text="권한"
          ></RoleChangeButton>
          <CommonButton
            color={ButtonColor.RED}
            onClick={() => {
              alert('추방되었습니다.');
            }}
            justifycontent="left"
            width="100%"
            height="40px"
            padding="10px"
            borderradius="10px"
          >
            추방하기
          </CommonButton>
        </>
      );
    }
    return null;
  };
  return (
    <Container>
      <Profile>
        <Profile__Header>
          <Profile__Header__Img src={detailProfile.imgUrl} />
          <Profile__Header__ButtonContainer>
            {props.sidebarType === SidebarType.VoiceChat ? (
              <>
                <IconButton beforeImgUrl={MicrophoneOn} afterImgUrl={MicrophoneOffRed} />
                <IconButton beforeImgUrl={HeadphoneOn} afterImgUrl={HeadphoneOffRed} />
              </>
            ) : (
              <IconButton beforeImgUrl={AddUser} afterImgUrl={Check} />
            )}
          </Profile__Header__ButtonContainer>
        </Profile__Header>
        <Profile__Nickname>{detailProfile.nickname}</Profile__Nickname>
        <p>{detailProfile.introduce}</p>
      </Profile>

      <ButtonContainer>{renderBtnContainer()}</ButtonContainer>
    </Container>
  );
};
