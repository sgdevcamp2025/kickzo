import instance from '@/api/axios.instance';
import { RegisterDto, UpdateUserRequestDto, UserResponseDto } from './user.interface';
import { logAxiosError } from '@/api/axios.log';
import { ErrorType } from '@/types/enums/ErrorType';

export const userApi = {
  // 내 프로필 조회
  getMyProfile: async () => {
    try {
      const { data } = await instance.get<UserResponseDto>('users/me');
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '내 프로필 조회 실패');
      throw error;
    }
  },

  // 내 프로필 수정
  updateMyProfile: async (updateUserRequestDto: UpdateUserRequestDto) => {
    try {
      const { data } = await instance.patch(`users/me`, updateUserRequestDto);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '내 프로필 수정 실패');
      throw error;
    }
  },

  // 프로필 이미지 업데이트
  updateProfileImage: async (profileImageUrl: string | null) => {
    const { data } = await instance.patch(`users/me/profile-image`, {
      profileImageUrl,
    });
    return data;
  },

  // 전체 유저 조회
  getUsers: async (page: number = 0, size: number = 10, nickname?: string) => {
    try {
      const { data } = await instance.get<{ users: UserResponseDto[]; totalLength: number }>(
      `users`,
      { params: { page, size, nickname } },
    );
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '전체 유저 조회 실패');
      throw error;
    }
  },

  // 프로필 조회
  getProfile: async (userId: string) => {
    try {
      const { data } = await instance.get<UserResponseDto>(`users/${userId}`);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '타 유저 프로필 조회 실패');
      throw error;
    }
  },

  // 이메일 존재 여부 확인
  checkEmailExists: async (email: string) => {
    try {
      const { data } = await instance.get(`users/exists?email=${email}`);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '이메일 존재 여부 확인 실패');
      throw error;
    }
  },

  // 닉네임 존재 여부 확인
  checkNicknameExists: async (nickname: string) => {
    try {
      const { data } = await instance.get(`users/exists?nickname=${nickname}`);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '닉네임 존재 여부 확인 실패');
      throw error;
    }
  },

  // 회원가입
  register: async (registerDto: RegisterDto) => {
    try {
      const { data } = await instance.post<UserResponseDto>(`users/register`, registerDto);
      return data;
    } catch (error) {
      logAxiosError(error, ErrorType.USER, '회원가입 실패');
      throw error;
    }
  },
};
