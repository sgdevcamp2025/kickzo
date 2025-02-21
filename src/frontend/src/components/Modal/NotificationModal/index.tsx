import { useEffect, useState } from 'react';
import { NotiContainer, NotiParagraph, NotiTitle } from './index.css';
import { RelativeModalContainer, Background } from '@/components/Modal/index.css';
import { NotificationCard } from './NotificationCard';
import { friendApi } from '@/api/endpoints/friend/friend.api';
import { NotificationDto } from '@/api/endpoints/friend/friend.interface';

interface INotification {
  onCancel: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const NotificationModal = ({ onCancel }: INotification) => {
  const [notiList, setNotiList] = useState<NotificationDto[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await friendApi.getNotifications();
        console.log('NOTI:', notifications);
        setNotiList(notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const props = {
    title: 'Notification',
    detail: 'Notification',
    confirmText: 'Notification',
    onCancel: onCancel,
  };

  const handleAccept = (notification: NotificationDto) => {
    friendApi.acceptFriend(notification.receiverId, notification.senderId);

    setNotiList(
      notiList.map(noti =>
        noti.timestamp === notification.timestamp ? { ...noti, status: 'ACCEPTED' } : noti,
      ),
    );
  };

  const handleReject = (notification: NotificationDto) => {
    friendApi.rejectFriend(notification.receiverId, notification.senderId);

    setNotiList(
      notiList.map(noti =>
        noti.timestamp === notification.timestamp ? { ...noti, status: 'REJECTED' } : noti,
      ),
    );
  };

  return (
    <>
      <Background $hasBackground={false} onClick={props.onCancel} />
      <RelativeModalContainer>
        <NotiContainer>
          <NotiTitle>알림</NotiTitle>
          {notiList.length > 0 ? (
            <>
              {notiList.map(noti => (
                <NotificationCard
                  key={noti.timestamp}
                  notification={noti}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
              <NotiParagraph>알림은 7일이 지나면 영구적으로 삭제됩니다.</NotiParagraph>
            </>
          ) : (
            <NotiParagraph>알림이 없습니다.</NotiParagraph>
          )}
        </NotiContainer>
      </RelativeModalContainer>
    </>
  );
};
