import { useState } from 'react';
import { IconButton } from '@/components/IconButton';
import {
  Container,
  Profile,
  Profile__Header,
  Profile__Header__Img,
  Profile__Header__ButtonContainer,
  Profile__MyNickname,
  Profile__MyIntroduce,
} from './index.css';

import Edit from '@/assets/img/Edit.svg';
import Check from '@/assets/img/Check.svg';
import Setting from '@/assets/img/Setting.svg';
import Cancel from '@/assets/img/Cancel.svg';

const detailProfile = {
  imgUrl:
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MjVfMTQ5%2FMDAxNTk1Njc4MzEyNzA4.knqIC64twrLoZDviHrAUSrEbgtxNp8h4nGsT-4mrWgkg.VImfsqV3F5GqyCPCIN4Xfid4TpUXQkljevfhuX_HK4gg.JPEG.haha9558%2FIMG_0114.JPG&type=a340',
  nickname: '이노',
  introduce: '저는 이제 집으로 갑니다',
};

export const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(detailProfile.nickname);
  const [introduce, setIntroduce] = useState(detailProfile.introduce);

  const handleSave = () => {
    setIsEditing(false);
    alert('닉네임과 상태 메시지가 저장되었습니다.');
  };

  return (
    <Container>
      <Profile>
        <Profile__Header>
          <Profile__Header__Img src={detailProfile.imgUrl} />
          <Profile__Header__ButtonContainer>
            <IconButton
              beforeImgUrl={isEditing ? Check : Edit}
              afterImgUrl={isEditing ? Check : Edit}
              onClick={() => {
                if (isEditing) {
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
                  alert('환경설정 페이지로 이동');
                }
              }}
            />
          </Profile__Header__ButtonContainer>
        </Profile__Header>

        <Profile__MyNickname
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          $isEditing={isEditing}
        />
        <Profile__MyIntroduce
          type="text"
          value={introduce}
          onChange={e => setIntroduce(e.target.value)}
          placeholder="상태 메시지를 입력하세요"
          $isEditing={isEditing}
        />
      </Profile>
    </Container>
  );
};
