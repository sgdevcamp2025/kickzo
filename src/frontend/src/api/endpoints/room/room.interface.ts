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
  profileImageUrl?: string;
  userCount: number;
  playlistUrl?: string;
  public?: boolean;
}

export interface PaginationDto {
  page: number;
  size: number;
}

export interface RoomDto {
  roomId: number;
  code: string;
  title: string;
  description?: string;
  creator: string;
  profileImageUrl?: string;
  userCount: number;
  playlistUrl?: string;
  public?: boolean;
}

export interface CurrentRoomUserDto {
  userId: number;
  role: number;
  nickname: string;
  profileImageUrl: string;
}

export interface CurrentRoomInfoDto {
  roomId: number;
  code: string;
  title: string;
  description: string;
  userCount: number;
  creator: string;
  profileImageUrl: string;
}

export interface CurrentRoomPlaylistDto {
  url: string;
  order: number;
}

export interface CurrentRoomDto {
  myRole: number;
  roomDetails: {
    userList: CurrentRoomUserDto[];
    roomInfo: CurrentRoomInfoDto[];
    playlist: CurrentRoomPlaylistDto[];
  };
}

export interface SendMessageDto {
  roomId: number;
  userId: number;
  nickname: string | null;
  role: number;
  profileImageUrl: string | null;
  content: string | null;
  message: string;
}

export interface ReceiveMessageDto extends SendMessageDto {
  id: string;
  timestamp: number;
}

export interface SearchUserDto {
  userId: number;
  nickname: string;
  stateMessage: string;
  profileImageUrl: string;
}

export interface ElasticSearchDto {
  users: SearchUserDto[];
  rooms: RoomDto[];
}
