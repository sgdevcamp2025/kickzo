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
  const treeRef = useRef<RedBlackTree<IUser> | null>(null);
  const [, setVersion] = useState(0);

  useEffect(() => {
    treeRef.current = new RedBlackTree<IUser>(compareUsers);
    memberListTest.forEach(user => treeRef.current?.insert(user));
    setVersion(v => v + 1);
  }, []);

  const addUser = (user: IUser) => {
    if (!treeRef.current) return;
    treeRef.current.insert(user);
    setVersion(v => v + 1);
  };

  const getSortedUsers = (): IUser[] => {
    return treeRef.current ? treeRef.current.inOrderTraversal() : [];
  };

  return { addUser, getSortedUsers };
};
