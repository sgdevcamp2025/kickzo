import { Wrapper, Profile, ChatContainer, Title, Title__Time, ChatText } from './index.css';
import { ChatNickname } from '@/components/Sidebar/Chating/ChatMessages/ChatLayout/ChatNickname';
import { ReceiveMessageDto } from '@/api/endpoints/room/room.interface';
import { formatDateToKorean } from '@/utils/dateUtils';
import DefaultProfile from '@/assets/img/DefaultProfile.svg';

export const ChatLayout = ({ message }: { message: ReceiveMessageDto }) => {
  return (
    <Wrapper>
      <Profile
        className="Profile"
        src={message.profileImageUrl ?? DefaultProfile}
        onError={e => {
          e.currentTarget.src = DefaultProfile;
        }}
      />
      <ChatContainer>
        <Title>
          <ChatNickname role={message.role} nickname={message.nickname ?? '알수없음'} />
          <Title__Time>{formatDateToKorean(message.timestamp ?? new Date().getTime())}</Title__Time>
        </Title>
        <ChatText>{message.message}</ChatText>
      </ChatContainer>
    </Wrapper>
  );
};
