import instance from '@/api/axios.instance';

export const fileApi = {
  // 파일 업로드를 위한 presigned URL 받아오기
  getPresignedUrl: async (fileName: string, contentType: string) => {
    const encodedFileName = encodeURIComponent(fileName);
    const { data } = await instance.get<string>(
      `files/upload/${encodedFileName}?contentType=${encodeURIComponent(contentType)}`
    );
    return data;
  },
};
