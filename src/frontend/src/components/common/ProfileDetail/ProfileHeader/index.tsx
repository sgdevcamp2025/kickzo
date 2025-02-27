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
import DefaultProfile from '@/assets/img/DefaultProfile.svg';
import { ProfileDetailDto } from '@/types/dto/ProfileDetailDto.dto';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { useUserStore } from '@/stores/useUserStore';
import axios from 'axios';
import { useFriendStore } from '@/stores/useFriendStore';
import UsersFill from '@/assets/img/UsersFill.svg';

export const ProfileHeader = (props: ProfileDetailDto) => {
  const me = useUserStore(state => state.user);
  const { friends } = useFriendStore();
  const isFriend = friends.some(friend => friend.friend_id === props.userId);

  const handleRequestFriend = async () => {
    if (!me || isFriend) return;

    try {
      await friendApi.requestFriend(me.userId, props.userId);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        const errorMessage = error.response.data.detail;
        if (errorMessage === '이미 친구 요청을 보냈습니다.') {
          alert(errorMessage);
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Profile__Header>
      <Profile__Header__Img
        src={props.imgUrl ?? DefaultProfile}
        onError={e => {
          e.currentTarget.src = DefaultProfile;
        }}
      />
      <Profile__Header__ButtonContainer>
        {props.sidebarType === SidebarType.VOICECHAT ? (
          <>
            <IconButton beforeImgUrl={MicrophoneOn} afterImgUrl={MicrophoneOffRed} />
            <IconButton beforeImgUrl={HeadphoneOn} afterImgUrl={HeadphoneOffRed} />
          </>
        ) : (
          <IconButton
            onClick={handleRequestFriend}
            beforeImgUrl={isFriend ? UsersFill : AddUser}
            afterImgUrl={isFriend ? UsersFill : Check}
          />
        )}
      </Profile__Header__ButtonContainer>
    </Profile__Header>
  );
};
