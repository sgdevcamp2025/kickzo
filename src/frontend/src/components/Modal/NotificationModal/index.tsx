import { useEffect } from 'react';
import { NotiContainer, NotiParagraph, NotiTitle } from './index.css';
import { RelativeModalContainer, Background } from '@/components/Modal/index.css';
import { NotificationCard } from './NotificationCard';
import { NotificationDto } from '@/api/endpoints/friend/friend.interface';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface INotification {
  onCancel: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const NotificationModal = ({ onCancel }: INotification) => {
  const {
    notifications,
    newNotificationCount,
    resetNotificationCount,
    fetchNotifications,
    acceptFriend,
    rejectFriend,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    resetNotificationCount();
  }, [newNotificationCount]);

  const handleAccept = async (notification: NotificationDto) => {
    try {
      await acceptFriend(notification);
    } catch (_error) {
      alert('친구 수락에 실패했습니다.');
    }
  };

  const handleReject = async (notification: NotificationDto) => {
    try {
      await rejectFriend(notification);
    } catch (_error) {
      alert('친구 거절에 실패했습니다.');
    }
  };

  return (
    <>
      <Background $hasBackground={false} onClick={onCancel} />
      <RelativeModalContainer>
        <NotiContainer>
          <NotiTitle>알림</NotiTitle>
          {notifications.length > 0 ? (
            <>
              {notifications.map(noti => (
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
