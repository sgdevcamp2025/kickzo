import { ChatNickname } from './chatNickname';
import ProfileImg from '@/assets/img/ProfileImg.svg';
import {
  Wrapper,
  Wrapper__Profile,
  Wrapper__Chat_Container,
  Wrapper__Chat_Container__Title,
  Time,
  Wrapper__Chat_Container__Chat,
} from './index.css';
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
      <Wrapper__Profile src={ProfileImg} />
      <Wrapper__Chat_Container>
        <Wrapper__Chat_Container__Title>
          <ChatNickname role={props.role} nickname={props.nickname} />
          <Time>{props.time}</Time>
        </Wrapper__Chat_Container__Title>
        <Wrapper__Chat_Container__Chat>{props.text}</Wrapper__Chat_Container__Chat>
      </Wrapper__Chat_Container>
    </Wrapper>
  );
};
