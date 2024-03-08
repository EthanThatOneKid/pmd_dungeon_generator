/**
 * DungeonTreeNode is a node in a DungeonTree.
 */
export interface DungeonTreeNode<T> {
	/**
	 * parent is the node that this node was split from.
	 */
	parent: DungeonTreeNode<T> | null;

	/**
	 * children are the two nodes that this node is split into.
	 */
	children: DungeonTreeNode<T>[];

	/**
	 * data is the data that this node holds.
	 */
	data: T;
}

/**
 * DungeonTree is a balanced binary tree for dungeon generation.
 */
export interface DungeonTree<T> {
	/**
	 * root is the root node of the tree.
	 */
	root: DungeonTreeNode<T>;

	/**
	 * leaves are the leaf nodes of the tree.
	 */
	leaves: DungeonTreeNode<T>[];
}

/**
 * eachLeaf walks the leaves of a tree and calls fn on each node.
 *
 * fn allows the node to be updated.
 */
export function eachLeaf<T>(tree: DungeonTree<T>, fn: (node: DungeonTreeNode<T>) => void): boolean {
	let seen = false;
	for (let i = tree.leaves.length - 1; i >= 0; i--) {
		const leaf = tree.leaves[i];
		fn(leaf);
		if (leaf.children.length === 0) {
			continue;
		}

		// Update the leaves.
		tree.leaves.splice(i, 1);
		tree.leaves.push(...leaf.children);

		// Set seen to true.
		seen = true;
	}

	return seen;
}

/**
 * walkTree walks the tree and calls fn on each node.
 */
export function walkTree<T>(
	node: DungeonTreeNode<T>,
	fn: (node: DungeonTreeNode<T>) => void
): void {
	fn(node);
	for (const child of node.children) {
		walkTree(child, fn);
	}
}
