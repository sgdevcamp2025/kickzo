import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;

export interface PlaylistItem {
  order: number;
  url: string;
  title?: string;
  youtuber?: string;
}

export interface VideoItem {
  id: string;
  start: number;
  thumbnail: string;
  title: string;
  youtuber: string;
}

// 사용자가 입력한 URL로부터 영상의 ID와 시간을 받아온다.
export const extractVideoIdAndStartTime = (url: string): { videoId: string; startTime: number } => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)(?:.*[?&]t=(\d+))?/;
  const match = url.match(regex);
  return {
    videoId: match ? match[1] : '',
    startTime: match && match[2] ? parseInt(match[2], 10) : 0,
  };
};

// YouTube API를 사용해 videoId에 해당하는 영상의 제목과 채널 정보를 가져옴
export const fetchVideoDetails = async (
  videoId: string,
): Promise<{ title: string; channelTitle: string }> => {
  try {
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: API_KEY,
        hl: 'ko',
      },
    });
    const items = data.items;
    if (items && items.length > 0) {
      const { title, channelTitle } = items[0].snippet;
      return { title, channelTitle };
    } else {
      return { title: '', channelTitle: '' };
    }
  } catch (error) {
    console.error('Failed to fetch video details:', error);
    return { title: '', channelTitle: '' };
  }
};

// Playlist 배열을 videoQueue 형식으로 변환
export const getVideoQueueFromPlaylist = async (playlist: PlaylistItem[]): Promise<VideoItem[]> => {
  const sortedPlaylist = [...playlist].sort((a, b) => a.order - b.order);
  const videoQueue = await Promise.all(
    sortedPlaylist.map(async item => {
      const { videoId, startTime } = extractVideoIdAndStartTime(item.url);
      let title = item.title || '';
      let youtuber = item.youtuber || '';
      if (!title || !youtuber) {
        try {
          const { title: fetchedTitle, channelTitle } = await fetchVideoDetails(videoId);
          if (!title) title = fetchedTitle;
          if (!youtuber) youtuber = channelTitle;
        } catch (error) {
          console.error('Error fetching video details for URL:', item.url, error);
          if (!title) title = '제목 없음';
          if (!youtuber) youtuber = '유튜버 정보 없음';
        }
      }
      return {
        id: videoId,
        start: startTime,
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        title,
        youtuber,
      };
    }),
  );
  return videoQueue;
};
