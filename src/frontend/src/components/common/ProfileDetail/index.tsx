import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { ProfileActions } from './ProfileActions';
import { Container, Profile, ButtonContainer } from './index.css';
import { ProfileDetailDto } from '@/types/dto/ProfileDetailDto.dto';
import { useEffect, useState } from 'react';
import { userApi } from '@/api/endpoints/user/user.api';
import { UserResponseDto } from '@/api/endpoints/user/user.interface';

export const ProfileDetail = (props: ProfileDetailDto) => {
  const [profile, setProfile] = useState<UserResponseDto | null>(null);

  useEffect(() => {
    const getprofile = async () => {
      const profile = await userApi.getProfile(props.userId.toString());
      setProfile(profile);
    };
    getprofile();
  }, [props.userId]);

  return (
    <Container>
      <Profile>
        <ProfileHeader {...props} />
        <ProfileInfo nickname={props.nickname} introduce={profile?.stateMessage} />
      </Profile>
      <ButtonContainer>
        <ProfileActions {...props} />
      </ButtonContainer>
    </Container>
  );
};
