import { useState } from 'react';
import { Chat } from './Chat';
import { MemberList } from './MemberList';
import { Playlist } from './Playlist';
import SidebarChat from '@/assets/img/SidebarChat.svg';
import SidebarPlaylist from '@/assets/img/SidebarPlaylist.svg';
import SidebarVoicechat from '@/assets/img/SidebarVoicechat.svg';
import SidebarMember from '@/assets/img/SidebarMember.svg';
import Add from '@/assets/img/Add.svg';
import { CommonInput } from '@/components/common/Input';
import { CommonButton } from '@/components/common/Button';
import { chatDataTest } from '@/assets/data/chatDataTest';
import { Wrapper, Nav, Content, NavButton, InputContainer, ChatContainer } from './index.css';
import { SidebarType } from '@/types/enums/SidebarType';
import { ButtonColor } from '@/types/enums/ButtonColor';

export const Sidebar = () => {
  const [interfaceType, setInterfaceType] = useState<SidebarType>(SidebarType.CHAT);

  const renderContent = () => {
    switch (interfaceType) {
      case SidebarType.CHAT:
        return (
          <ChatContainer>
            <ChatMessages />
            <ChatInput />
          </ChatContainer>
        );
      case SidebarType.PLAYLIST:
        return <Playlist />;
      case SidebarType.VOICECHAT:
        return <MemberList sidebarType={SidebarType.VOICECHAT} />;
      case SidebarType.MEMBER:
        return <MemberList sidebarType={SidebarType.MEMBER} />;
      default:
        return null;
    }
  };

  const navButtons = [
    { type: SidebarType.CHAT, icon: SidebarChat },
    { type: SidebarType.PLAYLIST, icon: SidebarPlaylist },
    { type: SidebarType.VOICECHAT, icon: SidebarVoicechat },
    { type: SidebarType.MEMBER, icon: SidebarMember },
  ];

  return (
    <Wrapper>
      <Nav>
        {navButtons.map(button => (
          <NavButton
            key={button.type}
            onClick={() => setInterfaceType(button.type)}
            $active={interfaceType === button.type}
          >
            <img src={button.icon} alt={`Sidebar ${button.type}`} />
          </NavButton>
        ))}
      </Nav>
      <Content>{renderContent()}</Content>
    </Wrapper>
  );
};

// 채팅창
const ChatMessages = () => (
  <div>
    {chatDataTest.map((chat, index) => (
      <Chat
        key={index}
        role={chat.role}
        nickname={chat.nickname}
        time={chat.time}
        text={chat.text}
      />
    ))}
  </div>
);

// 채팅 입력
const ChatInput = () => (
  <InputContainer>
    <CommonButton color={ButtonColor.TRANSPARENT} borderradius="20px">
      <img src={Add} alt="Add" />
    </CommonButton>
    <CommonInput placeholder="메시지 보내기" design={1} />
  </InputContainer>
);
