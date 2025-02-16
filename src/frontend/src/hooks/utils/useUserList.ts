import { useEffect, useRef, useState } from 'react';
import { memberListTest } from '@/assets/data/memberListTest';
import { RedBlackTree } from '@/hooks/utils/RedBlackTree';

export interface IUser {
  id: number;
  role: number;
  nickname: string;
  profileImg: string;
}

const compareUsers = (a: IUser, b: IUser): number => {
  if (a.role !== b.role) return a.role - b.role;
  const nicknameCompare = a.nickname.localeCompare(b.nickname, 'ko');
  if (nicknameCompare !== 0) return nicknameCompare;
  return a.id - b.id;
};

export const useUserList = () => {
  const treeRef = useRef<RedBlackTree<IUser>>();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    let initialUsers: IUser[] = [];
    const stored = localStorage.getItem('userList');
    if (stored) {
      try {
        initialUsers = JSON.parse(stored);
      } catch (e) {
        console.error('저장된 유저 리스트 파싱 에러', e);
        initialUsers = memberListTest;
      }
    } else {
      initialUsers = memberListTest;
      localStorage.setItem('userList', JSON.stringify(initialUsers));
    }
    const tree = new RedBlackTree<IUser>(compareUsers);
    initialUsers.forEach(user => tree.insert(user));
    treeRef.current = tree;
    setUsers(tree.inOrderTraversal());
  }, []);

  const addUser = (user: IUser) => {
    if (!treeRef.current) return;
    treeRef.current.insert(user);
    const updatedUsers = treeRef.current.inOrderTraversal();
    setUsers(updatedUsers);
    localStorage.setItem('userList', JSON.stringify(updatedUsers));
  };

  return { users, addUser };
};
