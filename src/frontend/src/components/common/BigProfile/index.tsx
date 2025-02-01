import { RoleChangeButton } from '@/components/RoleChangeButton';
import { CommonButton } from '@/components/common/Button';
import { IconButton } from '@/components/IconButton';

import { UserRole } from '@/types/enums/UserRole';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { SidebarType } from '@/types/enums/SidebarType';

import MicrophoneOn from '@/assets/img/MicrophoneOn.svg';
import MicrophoneOffRed from '@/assets/img/MicrophoneOffRed.svg';
import HeadphoneOn from '@/assets/img/HeadphoneOn.svg';
import HeadphoneOffRed from '@/assets/img/HeadphoneOffRed.svg';
import AddUser from '@/assets/img/AddUser.svg';
import Check from '@/assets/img/Check.svg';

import {
  Container,
  Profile,
  Profile__Header,
  Profile__Header__Img,
  Profile__Header__ButtonContainer,
  Profile__Nickname,
  ButtonContainer,
} from './index.css';

interface IBigProfile {
  userId: number;
  userRole: UserRole;
  myRole: UserRole;
  sidebarType: SidebarType;
}

// TODO - userId를 이용해서 해당 데이터를 API 콜로 받아오는 것을 변경하기
const detailProfile = {
  imgUrl:
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MjVfMTQ5%2FMDAxNTk1Njc4MzEyNzA4.knqIC64twrLoZDviHrAUSrEbgtxNp8h4nGsT-4mrWgkg.VImfsqV3F5GqyCPCIN4Xfid4TpUXQkljevfhuX_HK4gg.JPEG.haha9558%2FIMG_0114.JPG&type=a340',
  nickname: '이노',
  introduce: '저는 이제 집으로 갑니다',
};

export const BigProfile = (props: IBigProfile) => {
  const renderBtnContainer = () => {
    if (
      props.myRole === UserRole.OWNER &&
      props.userRole !== UserRole.OWNER &&
      props.sidebarType === SidebarType.VoiceChat
    ) {
      return (
        <>
          {/* TODO - 버튼 누를시 역할 변경 요청 보내기 */}
          <RoleChangeButton myRole={props.myRole} userRole={props.userRole} text="권한" />
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
    if (props.myRole === UserRole.OWNER && props.userRole !== UserRole.OWNER) {
      return (
        <>
          <RoleChangeButton myRole={props.myRole} userRole={props.userRole} text="권한" />
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
