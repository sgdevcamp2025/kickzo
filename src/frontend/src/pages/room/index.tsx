import { useState } from 'react';
import styled from 'styled-components';

import { Sidebar } from '@/components/sidebar';
import { YouTubePlayer } from '@/components/youtubePlayer';

export interface VideoItem {
  id: string;
  start: number;
  thumbnail: string;
  title: string;
  youtuber: string;
}

export const Room = () => {
  const [videoQueue, setVideoQueue] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <>
      {/* <BigProfile
        userId="test1"
        userRole={UserRole.USER}
        myRole={UserRole.OWNER}
        sidebarType={SidebarType.VoiceChat}
      /> */}
      <Wrapper>
        <YouTubePlayer
          videoQueue={videoQueue}
          setVideoQueue={setVideoQueue}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <Sidebar
          videoQueue={videoQueue}
          setVideoQueue={setVideoQueue}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
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
