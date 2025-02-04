import styled from 'styled-components';

import { Sidebar } from '@/components/Sidebar';
import { YouTubePlayer } from '@/components/YoutubePlayer';

export interface VideoItem {
  id: string;
  start: number;
  thumbnail: string;
  title: string;
  youtuber: string;
}

export const Room = () => {
  return (
    <>
      {/* <BigProfile
        userId="test1"
        userRole={UserRole.USER}
        myRole={UserRole.OWNER}
        sidebarType={SidebarType.VoiceChat}
      /> */}
      <Wrapper>
        <YouTubePlayer />
        <Sidebar />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
`;
