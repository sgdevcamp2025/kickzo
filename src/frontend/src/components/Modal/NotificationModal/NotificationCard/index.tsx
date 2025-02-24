import {
  Card,
  Message,
  Date,
  ButtonWrapper,
  AcceptButton,
  RejectButton,
  Strong,
} from './index.css';
import { NotificationDto } from '@/api/endpoints/friend/friend.interface';
import { formatDateToKorean } from '@/utils/dateUtils';

interface INotificationCard {
  notification: NotificationDto;
  onAccept: (notification: NotificationDto) => void;
  onReject: (notification: NotificationDto) => void;
}

export const NotificationCard = ({ notification, onAccept, onReject }: INotificationCard) => {
  const { type, senderNickname, roomId, timestamp, status } = notification;

  const message = (() => {
    if (type === 'room_request') {
      switch (status) {
        case 'PENDING':
          return (
            <>
              <Strong>{senderNickname}</Strong>님께서 <Strong>{roomId}</Strong>번 방에
              초대하셨습니다.
            </>
          );
        case 'ACCEPTED':
          return (
            <>
              <Strong>{senderNickname}</Strong>님의 초대를 수락하셨습니다.
            </>
          );
        case 'REJECTED':
          return (
            <>
              <Strong>{senderNickname}</Strong>님의 초대를 거절하셨습니다.
            </>
          );
      }
    } else {
      switch (status) {
        case 'PENDING':
          return (
            <>
              <Strong>{senderNickname}</Strong>님께서 친구 요청을 보냈습니다.
            </>
          );
        case 'ACCEPTED':
          return (
            <>
              <Strong>{senderNickname}</Strong>님의 친구 요청을 수락하셨습니다.
            </>
          );
        case 'REJECTED':
          return (
            <>
              <Strong>{senderNickname}</Strong>님의 친구 요청을 거절하셨습니다.
            </>
          );
      }
    }
  })();

  const renderButtons = () => {
    switch (status) {
      case 'PENDING':
        return (
          <>
            <AcceptButton onClick={() => onAccept(notification)}>수락</AcceptButton>
            <RejectButton onClick={() => onReject(notification)}>거절</RejectButton>
          </>
        );
      case 'ACCEPTED':
        return <AcceptButton disabled>수락됨</AcceptButton>;
      case 'REJECTED':
        return <RejectButton disabled>거절됨</RejectButton>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <Message>{message}</Message>
      <Date>{formatDateToKorean(timestamp)}</Date>
      <ButtonWrapper>{renderButtons()}</ButtonWrapper>
    </Card>
  );
};
