export interface MyRoomDto {
  id: number;
  code: string;
  title: string;
  description?: string;
  creator: string;
  profileImageUrl: string;
  userCount: number;
  playlistUrl: string;
}
