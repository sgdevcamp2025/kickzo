export interface FriendDto {
  friend_id: number;
  nickname: string;
  profile_image_url?: string;
  role: number;
  status: string;
}

export interface NotificationDto {
  isRead: boolean;
  receiverId: number;
  receiverNickname: string;
  roomCode: string | null;
  roomId: string | null;
  senderId: number;
  senderNickname: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  timestamp: number;
  type: 'friend_request' | 'room_request';
}
