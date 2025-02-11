import { useState } from 'react';
import { ChatBox } from './Chating';
import { MemberList } from './MemberList';
import { Playlist } from './Playlist';
import SidebarChat from '@/assets/img/SidebarChat.svg';
import SidebarPlaylist from '@/assets/img/SidebarPlaylist.svg';
import SidebarVoicechat from '@/assets/img/SidebarVoicechat.svg';
import SidebarMember from '@/assets/img/SidebarMember.svg';
import { Wrapper, Nav, Content, NavButton } from './index.css';
import { SidebarType } from '@/types/enums/SidebarType';

export const Sidebar = () => {
  const [interfaceType, setInterfaceType] = useState<SidebarType>(SidebarType.CHAT);

  const renderContent = () => {
    switch (interfaceType) {
      case SidebarType.CHAT:
        return <ChatBox />;
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

  return (
    <Wrapper>
      <Nav>
        {[SidebarType.CHAT, SidebarType.PLAYLIST, SidebarType.VOICECHAT, SidebarType.MEMBER].map(
          (type, index) => (
            <NavButton
              key={index}
              onClick={() => setInterfaceType(type)}
              $active={interfaceType === type}
            >
              <img
                src={[SidebarChat, SidebarPlaylist, SidebarVoicechat, SidebarMember][index]}
                alt={`Sidebar ${type}`}
              />
            </NavButton>
          ),
        )}
      </Nav>
      <Content>{renderContent()}</Content>
    </Wrapper>
  );
};
