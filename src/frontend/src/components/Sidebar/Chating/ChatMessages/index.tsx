import { UserRole } from '@/types/enums/UserRole';
// import { ChatLayout } from '@/components/Sidebar/Chating/ChatMessages/ChatLayout';
import { ChatLayout } from '@/components/Sidebar/Chating/ChatMessages/ChatLayout';

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
        <ChatLayout
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
