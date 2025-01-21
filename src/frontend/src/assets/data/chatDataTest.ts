enum UserRole {
  OWNER,
  MANAGER,
  USER,
}

export const chatDataTest = [
  {
    role: UserRole.OWNER,
    nickname: '이노',
    time: '오후 12시 13분',
    text: '이노바보야 이노바보야 이노바보야',
  },
  {
    role: UserRole.MANAGER,
    nickname: '매니저',
    time: '오후 12시 14분',
    text: 'ㅎㅎ',
  },
];
