import { useState } from "react";
import { ProfileButtonContainer } from "@/components/common/ProfileDetail/ButtonContainer";
import { ProfileContent } from "@/components/common/ProfileDetail/ProfileContent";

import { UserRole } from "@/types/enums/UserRole";
import { ProfileDetailType } from "@/types/enums/ProfileDetailType";
import { RightButtonContainer } from "./RightButtonContainer";

import {
  Container,
  Profile,
  Profile__Header,
  Profile__Header__Img,
  Profile__Header__ButtonContainer,
} from "./index.css";

interface IProfileDetail {
  userId: number;
  userRole: UserRole;
  myRole: UserRole;
  profileDetailType: ProfileDetailType;
}

const detailProfile = {
  imgUrl:
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MjVfMTQ5%2FMDAxNTk1Njc4MzEyNzA4.knqIC64twrLoZDviHrAUSrEbgtxNp8h4nGsT-4mrWgkg.VImfsqV3F5GqyCPCIN4Xfid4TpUXQkljevfhuX_HK4gg.JPEG.haha9558%2FIMG_0114.JPG&type=a340",
  nickname: "이노",
  introduce: "저는 이제 집으로 갑니다",
};

export const ProfileDetail = (props: IProfileDetail) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(detailProfile.nickname);
  const [introduce, setIntroduce] = useState(detailProfile.introduce);

  return (
    <Container>
      <Profile>
        <Profile__Header>
          <Profile__Header__Img src={detailProfile.imgUrl} />
          <Profile__Header__ButtonContainer>
            <RightButtonContainer
              profileDetailType={props.profileDetailType}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setNickname={setNickname}
              setIntroduce={setIntroduce}
            />
          </Profile__Header__ButtonContainer>
        </Profile__Header>
        <ProfileContent
          profileDetailType={props.profileDetailType}
          isEditing={isEditing}
          nickname={nickname}
          setNickname={setNickname}
          introduce={introduce}
          setIntroduce={setIntroduce}
        />
      </Profile>
      <ProfileButtonContainer
        myRole={props.myRole}
        userRole={props.userRole}
        profileDetailType={props.profileDetailType}
      />
    </Container>
  );
};
