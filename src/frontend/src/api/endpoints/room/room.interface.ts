export interface RoomRequestDto {
  title: string;
  description: string;
  isPublic: boolean;
}

export interface PlaylistDto {
  order: number;
  url: string;
}

export interface MyRoomDto {
  roomId: number;
  code: string;
  title: string;
  description?: string;
  creator: string;
  profileImageUrl: string;
  userCount: number;
  playlistUrl: string;
}
