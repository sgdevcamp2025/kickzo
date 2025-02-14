import { useState } from 'react';
import { NotiContainer, NotiParagraph, NotiTitle } from './index.css';
import { RelativeModalContainer, Background } from '@/components/Modal/index.css';
import { NotificationCard } from './NotificationCard';
import { notificationListTest } from '@/assets/data/notificationListTest';

interface INotification {
  onCancel: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const NotificationModal = ({ onCancel }: INotification) => {
  const notifications = notificationListTest;

  const [notiList, setNotiList] = useState(notifications);

  const props = {
    title: 'Notification',
    detail: 'Notification',
    confirmText: 'Notification',
    onCancel: onCancel,
  };

  const handleAccept = (id: number) => {
    console.log(`초대 ID ${id} 수락`);
    setNotiList(notiList.filter(noti => noti.id !== id)); // 수락하면 목록에서 제거
  };

  const handleReject = (id: number) => {
    console.log(`초대 ID ${id} 거절`);
    setNotiList(notiList.filter(noti => noti.id !== id)); // 거절하면 목록에서 제거
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
                  key={noti.id}
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
