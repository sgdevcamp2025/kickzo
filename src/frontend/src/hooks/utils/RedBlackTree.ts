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

export class RedBlackTree<T> {
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
    if (y.left) {
      y.left.parent = x;
    }
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
    if (x.right) {
      x.right.parent = y;
    }
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
