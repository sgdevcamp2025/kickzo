import {
  Card,
  Message,
  Date,
  ButtonWrapper,
  AcceptButton,
  RejectButton,
  Strong,
} from './index.css';
import { NotificationDto } from '@/types/dto/Notification.dto';
import { formatDateToKorean } from '@/utils/dateUtils';

interface INotificationCard {
  notification: NotificationDto;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export const NotificationCard = ({ notification, onAccept, onReject }: INotificationCard) => {
  return (
    <Card>
      <Message>
        {notification.type === 'room_invite' ? (
          <>
            <Strong>{notification.sender.nickname}</Strong>님께서{' '}
            <Strong>{notification.roomTitle}</Strong> 방에 초대하셨습니다.
          </>
        ) : (
          <>
            <Strong>{notification.sender.nickname}</Strong>님께서 친구 요청을 보냈습니다.
          </>
        )}
      </Message>
      <Date>{formatDateToKorean(notification.timestamp)}</Date>
      <ButtonWrapper>
        {notification.status === 'pending' && (
          <>
            <AcceptButton onClick={() => onAccept(notification.id)}>수락</AcceptButton>
            <RejectButton onClick={() => onReject(notification.id)}>거절</RejectButton>
          </>
        )}
        {notification.status === 'accepted' && <AcceptButton disabled={true}>수락</AcceptButton>}
        {notification.status === 'rejected' && <RejectButton disabled={true}>거절</RejectButton>}
      </ButtonWrapper>
    </Card>
  );
};
