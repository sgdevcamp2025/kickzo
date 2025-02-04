export const notificationListTest = [
  {
    id: 1,
    type: 'room_invite',
    sender: {
      id: 2,
      nickname: '철수',
    },
    roomTitle: 'React 스터디',
    timestamp: '2025-02-03T12:00:00',
    status: 'pending',
  },
  {
    id: 2,
    type: 'friend_request',
    sender: {
      id: 3,
      nickname: '영희',
    },
    timestamp: '2025-02-02T11:42:00',
    status: 'rejected',
  },
  {
    id: 3,
    type: 'room_invite',
    sender: {
      id: 4,
      nickname: '민수',
    },
    roomTitle: 'TypeScript 스터디',
    timestamp: '2025-02-01T10:30:00',
    status: 'accepted',
  },
];
