import { FriendDto } from "@/api/endpoints/friend/friend.interface";
import { FriendCardContainer, FriendCardImage } from "./index.css";
import DefaultProfile from '@/assets/img/DefaultProfile.svg';


export const FriendCard = ({ friend }: { friend: FriendDto }) => {
  return (
    <FriendCardContainer>
      <FriendCardImage $isOnline={friend.status != 'offline'}>
        <img src={friend.profile_image_url ?? DefaultProfile} alt="profile" />
      </FriendCardImage>
      <div>{friend.nickname}</div>
    </FriendCardContainer>
  );
};


