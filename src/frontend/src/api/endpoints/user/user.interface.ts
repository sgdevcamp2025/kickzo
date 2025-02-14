export interface UpdateUserRequestDto {
  nickname?: string;
  stateMessage?: string;
}

export interface UserResponseDto {
  userId: number;
  email: string;
  nickname: string;
  role: number;
  profileImageUrl: string | null;
  profileImages: string[] | null;
  stateMessage: string;
}
