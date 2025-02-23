import instance from '@/api/axios.instance';
import { RegisterDto, UpdateUserRequestDto, UserResponseDto } from './user.interface';

export const userApi = {
  // 내 프로필 조회
  getMyProfile: async () => {
    const { data } = await instance.get<UserResponseDto>('users/me');
    return data;
  },

  // 내 프로필 수정
  updateMyProfile: async (updateUserRequestDto: UpdateUserRequestDto) => {
    const { data } = await instance.patch(`users/me`, updateUserRequestDto);
    return data;
  },

  // 프로필 이미지 업데이트
  updateProfileImage: async (profileImageUrl: string) => {
    const { data } = await instance.patch(`users/me/profile-image`, {
      profileImageUrl,
    });
    return data;
  },

  // 전체 유저 조회
  getUsers: async (page: number = 0, size: number = 10) => {
    const { data } = await instance.get(`users`, { params: { page, size } });
    return data;
  },

  // 프로필 조회
  getProfile: async (userId: string) => {
    const { data } = await instance.get<UserResponseDto>(`users/${userId}`);
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

  // 회원가입
  register: async (registerDto: RegisterDto) => {
    const { data } = await instance.post<UserResponseDto>(`users/register`, registerDto);
    return data;
  },
};
