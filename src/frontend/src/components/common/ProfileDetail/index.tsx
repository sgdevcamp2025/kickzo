import React, { useState } from 'react';

import { RoleChangeButton } from '@/components/RoleChangeButton';
import { CommonButton } from '@/components/common/Button';
import { IconButton } from '@/components/IconButton';

import { UserRole } from '@/types/enums/UserRole';
import { ButtonColor } from '@/types/enums/ButtonColor';
import { SidebarType } from '@/types/enums/SidebarType';

import Edit from '@/assets/img/Edit.svg';
import Check from '@/assets/img/Check.svg';
import Setting from '@/assets/img/Setting.svg';
import Cancel from '@/assets/img/Cancel.svg';

import {
  Container,
  Profile,
  Profile__Header,
  Profile__Header__Img,
  Profile__Header__ButtonContainer,
  Profile__Nickname,
  Profile__MyNickname,
  Profile__MyIntroduce,
  ButtonContainer,
} from './index.css';

interface IProfileDetail {
  userId: number;
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

export const ProfileDetail = (props: IProfileDetail) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(detailProfile.nickname);
  const [introduce, setIntroduce] = useState(detailProfile.introduce);

  const handleSave = () => {
    setIsEditing(false);
    alert('닉네임과 상태 메시지가 저장되었습니다.');
  };

  const renderEditButton = () => (
    <>
      <IconButton
        beforeImgUrl={isEditing ? Check : Edit}
        afterImgUrl={isEditing ? Check : Edit}
        onClick={() => {
          if (isEditing) {
            // TODO - 성공시 비밀번호 변경
            handleSave();
          } else {
            setIsEditing(true);
          }
        }}
      />
      <IconButton
        beforeImgUrl={isEditing ? Cancel : Setting}
        afterImgUrl={isEditing ? Cancel : Setting}
        onClick={() => {
          if (isEditing) {
            setIsEditing(false);
            setNickname(detailProfile.nickname);
            setIntroduce(detailProfile.introduce);
          } else {
            // TODO - 환경설정 페이지로 넘어감
          }
        }}
      />
    </>
  );

  const renderContent = () => {
    if (props.sidebarType === SidebarType.EDIT && isEditing) {
      return (
        <>
          <Profile__MyNickname
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
          <Profile__MyIntroduce
            type="text"
            value={introduce}
            onChange={e => setIntroduce(e.target.value)}
            placeholder="상태 메시지를 입력하세요"
          />
        </>
      );
    }
    return (
      <>
        <Profile__Nickname>{nickname}</Profile__Nickname>
        <p>{introduce}</p>
      </>
    );
  };

  const renderBtnContainer = () => {
    if (props.sidebarType == SidebarType.EDIT) return null;
    if (
      props.myRole === UserRole.CREATOR &&
      props.userRole !== UserRole.CREATOR &&
      props.sidebarType === SidebarType.VOICECHAT
    ) {
      return (
        <>
          <RoleChangeButton myRole={props.myRole} userRole={props.userRole} text="권한" />
          <CommonButton
            color={ButtonColor.RED}
            onClick={() => alert('방장에 의해 연결이 끊겼습니다.')}
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
            onClick={() => alert('추방되었습니다.')}
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
    if (props.myRole === UserRole.CREATOR && props.userRole !== UserRole.CREATOR) {
      return (
        <>
          <RoleChangeButton myRole={props.myRole} userRole={props.userRole} text="권한" />
          <CommonButton
            color={ButtonColor.RED}
            onClick={() => alert('추방되었습니다.')}
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
            {props.sidebarType === SidebarType.EDIT && renderEditButton()}
          </Profile__Header__ButtonContainer>
        </Profile__Header>
        {renderContent()}
      </Profile>
      <ButtonContainer>{renderBtnContainer()}</ButtonContainer>
    </Container>
  );
};
