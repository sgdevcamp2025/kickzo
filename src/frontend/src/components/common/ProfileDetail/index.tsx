import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { ProfileActions } from './ProfileActions';
import { Container, Profile, ButtonContainer } from './index.css';
import { ProfileDetailDto } from '@/types/dto/ProfileDetailDto.dto';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';

const detailProfile = {
  nickname: '이노',
  introduce: '저는 이제 집으로 갑니다',
  imgUrl:
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MjVfMTQ5%2FMDAxNTk1Njc4MzEyNzA4.knqIC64twrLoZDviHrAUSrEbgtxNp8h4nGsT-4mrWgkg.VImfsqV3F5GqyCPCIN4Xfid4TpUXQkljevfhuX_HK4gg.JPEG.haha9558%2FIMG_0114.JPG&type=a340',
};

export const ProfileDetail = (props: ProfileDetailDto) => {
  return (
    <Container>
      <Profile>
        <ProfileHeader sidebarType={props.sidebarType} imgUrl={props.imgUrl || DefaultProfile} />
        <ProfileInfo nickname={props.nickname} introduce={detailProfile.introduce} />
      </Profile>
      <ButtonContainer>
        <ProfileActions {...props} />
      </ButtonContainer>
    </Container>
  );
};
