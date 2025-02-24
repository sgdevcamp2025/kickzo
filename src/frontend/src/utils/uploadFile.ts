import axios from 'axios';
import { fileApi } from '@/api/endpoints/file/file.api';

export const uploadImageToS3 = async (file: File): Promise<string> => {
  try {
    // presigned URL 받아오기
    const presignedUrl = await fileApi.getPresignedUrl(file.name, file.type);

    // S3에 업로드
    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    if (uploadResponse.status !== 200) {
      throw new Error('Failed to upload image');
    }

    // 최종 이미지 URL (presigned URL에서 쿼리 파라미터 제거)
    return presignedUrl.split('?')[0];
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
