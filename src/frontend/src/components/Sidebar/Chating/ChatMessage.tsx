import { UserRole } from '@/types/enums/UserRole';
import { Chat } from '../Chat';

interface IChatMessages {
  chatData: {
    role: UserRole;
    nickname: string;
    time: string;
    text: string;
  }[];
}

export const ChatMessages = (props: IChatMessages) => {
  return (
    <>
      {props.chatData.map((chat, index) => (
        <Chat
          key={index}
          role={chat.role}
          nickname={chat.nickname}
          time={chat.time}
          text={chat.text}
        />
      ))}
    </>
  );
};
