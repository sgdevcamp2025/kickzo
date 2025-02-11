import instance from '@/api/axios.instance';
import { UpdateUserRequestDto, UserResponseDto } from './user.interface';

export const userApi = {
  // 내 프로필 조회
  getMyProfile: async () => {
    const { data } = await instance.get<UserResponseDto>('users/profile');
    return data;
  },

  // 내 프로필 수정
  updateMyProfile: async (updateUserRequestDto: UpdateUserRequestDto) => {
    const { data } = await instance.patch(`users/profile`, updateUserRequestDto);
    return data;
  },

  // 프로필 조회
  getProfile: async (userId: string) => {
    const { data } = await instance.get<UserResponseDto>(`users/profile/${userId}`);
    return data;
  },

  // 이메일 존재 여부 확인
  checkEmailExists: async (email: string) => {
    const { data } = await instance.get(`users/exists?email=${email}`);
    return data;
  },

  // 닉네임 존재 여부 확인
  checkNicknameExists: async (nickname: string) => {
    const { data } = await instance.get(`users/exists?nickname=${nickname}`);
    return data;
  },
};
