export class DungeonTreeNode<T> {
	constructor(
		/**
		 * parent is the node that this node was split from.
		 */
		public readonly parent: DungeonTreeNode<T> | null,

		/**
		 * children are the two nodes that this node is split into.
		 */
		public readonly children: DungeonTreeNode<T>[],

		/**
		 * roomData is the data that this node holds.
		 */
		public roomData: T

		// public isLeaf: boolean,
		// public isRoom: boolean,
		// public roomData: T, // replace with the data structure you need for your room
		// public split: 'horizontal' | 'vertical' | null
	) {}
}

/**
 * Balanced binary tree for dungeon generation.
 *
 * @see
 * https://www.roguebasin.com/index.php/Basic_BSP_Dungeon_generation
 */
export class DungeonTree<T> {
	public root: DungeonTreeNode<T> | null = null;
	public leaves: DungeonTreeNode<T>[] = [];

	public addNode(
		parent: DungeonTreeNode<T> | null,
		isLeaf: boolean,
		roomData: T // replace with the data structure you need for your room
	): DungeonTreeNode<T> {
		const newNode = new DungeonTreeNode(parent, [], roomData);
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
