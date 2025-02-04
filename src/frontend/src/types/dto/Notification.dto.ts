export interface NotificationDto {
  id: number;
  type: string;
  sender: Sender;
  roomTitle?: string;
  timestamp: string;
  status: string;
}

interface Sender {
  id: number;
  nickname: string;
}
