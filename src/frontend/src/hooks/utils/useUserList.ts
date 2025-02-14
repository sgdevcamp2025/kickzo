import { useEffect, useRef, useState } from 'react';
import { memberListTest } from '@/assets/data/memberListTest';

export interface IUser {
  id: number;
  role: number;
  nickname: string;
  profileImg: string;
}

type Color = 'red' | 'black';

class RBNode<T> {
  data: T;
  color: Color;
  left: RBNode<T> | null = null;
  right: RBNode<T> | null = null;
  parent: RBNode<T> | null = null;
  constructor(data: T, color: Color = 'red') {
    this.data = data;
    this.color = color;
  }
}

class RedBlackTree<T extends { nickname: string }> {
  root: RBNode<T> | null = null;
  compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  insert(data: T) {
    const newNode = new RBNode(data);
    let y: RBNode<T> | null = null;
    let x = this.root;

    while (x !== null) {
      y = x;
      if (this.compare(newNode.data, x.data) < 0) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    newNode.parent = y;
    if (y === null) {
      this.root = newNode;
    } else if (this.compare(newNode.data, y.data) < 0) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    newNode.color = 'red';
    this.fixInsert(newNode);
  }

  private fixInsert(z: RBNode<T>) {
    while (z.parent && z.parent.color === 'red') {
      if (z.parent === z.parent.parent?.left) {
        const y = z.parent.parent.right;
        if (y && y.color === 'red') {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.leftRotate(z);
          }
          z.parent!.color = 'black';
          if (z.parent!.parent) {
            z.parent!.parent.color = 'red';
            this.rightRotate(z.parent!.parent);
          }
        }
      } else {
        const y = z.parent.parent?.left;
        if (y && y.color === 'red') {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent!.color = 'red';
          z = z.parent.parent!;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rightRotate(z);
          }
          z.parent!.color = 'black';
          if (z.parent!.parent) {
            z.parent!.parent.color = 'red';
            this.leftRotate(z.parent!.parent);
          }
        }
      }
    }
    if (this.root) {
      this.root.color = 'black';
    }
  }

  private leftRotate(x: RBNode<T>) {
    const y = x.right;
    if (!y) return;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  private rightRotate(y: RBNode<T>) {
    const x = y.left;
    if (!x) return;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;
    if (!y.parent) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
  }

  deleteByName(nickname: string) {
    const users = this.inOrderTraversal().filter(user => user.nickname !== nickname);
    this.root = null;
    users.forEach(user => this.insert(user));
  }

  inOrderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: RBNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.data);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }
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

  // TODO: 추후 유저의 ID를 이용해서 삭제하는 기능으로 변경 예정
  const removeUser = (nickname: string) => {
    if (!treeRef.current) return;
    treeRef.current.deleteByName(nickname);
    const updatedUsers = treeRef.current.inOrderTraversal();
    setUsers(updatedUsers);
    localStorage.setItem('userList', JSON.stringify(updatedUsers));
  };

  return { users, addUser, removeUser };
};
