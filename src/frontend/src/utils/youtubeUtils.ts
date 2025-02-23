export const getYoutubeVideoInfo = async (videoId: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`,
  );
  const data = await response.json();
  return data;
};

// 유튜브 썸네일 이미지 가져오기
// maxres: 1280p, sd: 640p, hq: 480p, default: 120p
export const getYoutubeThumbnail = (
  url: string | undefined,
  quality: 'default' | 'hq' | 'sd' | 'maxres',
): string | undefined => {
  if (!url) return undefined;

  const videoId = url.split('v=')[1];
  if (!videoId) return url;

  const qualityMap = {
    maxres: 'maxresdefault',
    sd: 'sddefault',
    hq: 'hqdefault',
    default: 'default',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};
