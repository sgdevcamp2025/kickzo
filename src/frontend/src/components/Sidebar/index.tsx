import { useState } from 'react';
import { ChatBox } from './Chating';
import { MemberList } from './MemberList';
import { Playlist } from './Playlist';
import { VoiceChat } from './VoiceChat';
import SidebarChat from '@/assets/img/SidebarChat.svg';
import SidebarPlaylist from '@/assets/img/SidebarPlaylist.svg';
import SidebarVoicechat from '@/assets/img/SidebarVoicechat.svg';
import SidebarMember from '@/assets/img/SidebarMember.svg';
import { Wrapper, Nav, Content, NavButton } from './index.css';
import { SidebarType } from '@/types/enums/SidebarType';

export const Sidebar = () => {
  const [interfaceType, setInterfaceType] = useState<SidebarType>(SidebarType.CHAT);

  const contentComponents = {
    [SidebarType.CHAT]: ChatBox,
    [SidebarType.PLAYLIST]: Playlist,
    [SidebarType.VOICECHAT]: VoiceChat,
    [SidebarType.MEMBER]: MemberList,
  };

  const renderContent = () => {
    const Component = contentComponents[interfaceType];
    return Component ? <Component /> : null;
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
