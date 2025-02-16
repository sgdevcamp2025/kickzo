export interface SendMessageDto {
  roomId: number;
  userId: number;
  content?: string;
  message?: string;
}

export interface ReceiveMessageDto extends SendMessageDto {
  timestamp: string;
}
