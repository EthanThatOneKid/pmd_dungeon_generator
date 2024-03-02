class DungeonTreeNode {
	constructor(
		public readonly parent: DungeonTreeNode | null,
		public readonly children: DungeonTreeNode[],
		public isLeaf: boolean,
		public isRoom: boolean,
		public roomData: any, // replace with the data structure you need for your room
		public split: 'horizontal' | 'vertical' | null
	) {}
}

class DungeonTree {
	public root: DungeonTreeNode | null = null;
	public leaves: DungeonTreeNode[] = [];

	public addNode(
		parent: DungeonTreeNode | null,
		isLeaf: boolean,
		isRoom: boolean,
		roomData: any, // replace with the data structure you need for your room
		split: 'horizontal' | 'vertical' | null
	): DungeonTreeNode {
		const newNode = new DungeonTreeNode(parent, [], isLeaf, isRoom, roomData, split);
		if (parent) {
			parent.children.push(newNode);
		} else {
			this.root = newNode;
		}
		if (isLeaf) {
			this.leaves.push(newNode);
		}
		return newNode;
	}
}

// Usage example
const tree = new DungeonTree();
const rootNode = tree.addNode(null, false, false, null, null);
const leftNode = tree.addNode(rootNode, true, true, { size: 10, location: [10, 10] }, 'horizontal');
const rightNode = tree.addNode(
	rootNode,
	true,
	true,
	{ size: 15, location: [20, 10] },
	'horizontal'
);

console.log(tree);

// https://www.youtube.com/watch?v=S5y3ES4Rvkk
