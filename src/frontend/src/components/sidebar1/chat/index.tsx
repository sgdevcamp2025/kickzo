import { ChatNickname } from './chatNickname';
import ProfileImg from '@/assets/img/ProfileImg.svg';
import { Wrapper, Profile, ChatContainer, Title, Title__Time, ChatText } from './index.css';
import { UserRole } from '@/types/enums/UserRole';

interface IChat {
  role: UserRole;
  nickname: string;
  time: string;
  text: string;
}

export const Chat = (props: IChat) => {
  return (
    <Wrapper>
      <Profile className="Profile" src={ProfileImg} />
      <ChatContainer>
        <Title>
          <ChatNickname role={props.role} nickname={props.nickname} />
          <Title__Time>{props.time}</Title__Time>
        </Title>
        <ChatText>{props.text}</ChatText>
      </ChatContainer>
    </Wrapper>
  );
};
