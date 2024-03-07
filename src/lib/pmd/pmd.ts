import type { DungeonTree, DungeonTreeNode } from './tree';
import { eachLeaf } from './tree';

/**
 * PMDDungeonOptions are options for generating a PMD dungeon.
 */
export interface PMDDungeonOptions {
	width: number;
	height: number;
	minNodeSideLength: number;
	roomMarginSize: number;
	minRoomSideLength: number;
}

/**
 * PMDDungeon is a PMD dungeon.
 */
export type PMDDungeon = DungeonTree<PMDDungeonNodeData>;

/**
 * generateDungeon generates a PMD dungeon.
 */
export function generateDungeon(options: PMDDungeonOptions): PMDDungeon {
	const tree: PMDDungeon = {
		root: {
			parent: null,
			children: [],
			data: { x: 0, y: 0, width: options.width, height: options.height }
		},
		leaves: []
	};
	tree.leaves.push(tree.root!);

	// While there are leaves to split, split them.
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const hasLeaves = eachLeaf(tree, (node) => {
			if (!maySplit(node.data, options.minNodeSideLength)) {
				return;
			}

			// Split the node.
			split(node);
		});
		if (!hasLeaves) {
			break;
		}
	}

	// Create a room with random size in each leaf of the tree.
	eachLeaf(tree, (node) => {
		node.data.room = generateRoom(node.data, options.roomMarginSize, options.minRoomSideLength);
	});

	return tree;
}

export enum PMDDungeonNodeSplitType {
	HORIZONTAL = 'horizontal',
	VERTICAL = 'vertical'
}

export interface PMDDungeonNodeSplit {
	type: PMDDungeonNodeSplitType;
	ratio: number;
}

export interface PMDDungeonNodeRoom {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface PMDDungeonNodeData {
	x: number;
	y: number;
	width: number;
	height: number;
	split?: PMDDungeonNodeSplit;
	room?: PMDDungeonNodeRoom;
}

/**
 * maySplit returns true if the node is large enough to split.
 */
function maySplit(node: PMDDungeonNodeData, minRoomSideLength: number): boolean {
	return node.width > minRoomSideLength * 2 && node.height > minRoomSideLength * 2;
}

/**
 * split splits a node into two children.
 */
function split(node: DungeonTreeNode<PMDDungeonNodeData>): void {
	if (node.data.split) {
		throw new Error('node already split');
	}

	node.data.split = {
		type:
			Math.random() > 0.5 ? PMDDungeonNodeSplitType.HORIZONTAL : PMDDungeonNodeSplitType.VERTICAL,
		ratio: Math.random() * 0.5 + 0.25
	};

	// If the split is horizontal, split the node into two children horizontally.
	// If the split is vertical, split the node into two children vertically.
	const child0: DungeonTreeNode<PMDDungeonNodeData> = {
		parent: node,
		children: [],
		data: {
			x: node.data.x,
			y: node.data.y,
			width:
				node.data.split?.type === PMDDungeonNodeSplitType.HORIZONTAL
					? node.data.width
					: node.data.width * node.data.split.ratio,
			height:
				node.data.split?.type === PMDDungeonNodeSplitType.HORIZONTAL
					? node.data.height * node.data.split.ratio
					: node.data.height
		}
	};
	node.children.push(child0);

	const child1: DungeonTreeNode<PMDDungeonNodeData> = {
		parent: node,
		children: [],
		data: {
			x:
				node.data.split?.type === PMDDungeonNodeSplitType.HORIZONTAL
					? node.data.x
					: node.data.x + child0.data.width,
			y:
				node.data.split?.type === PMDDungeonNodeSplitType.HORIZONTAL
					? node.data.y + child0.data.height
					: node.data.y,
			width:
				node.data.split?.type === PMDDungeonNodeSplitType.HORIZONTAL
					? node.data.width
					: node.data.width * (1 - node.data.split.ratio),
			height:
				node.data.split?.type === PMDDungeonNodeSplitType.HORIZONTAL
					? node.data.height * (1 - node.data.split.ratio)
					: node.data.height
		}
	};
	node.children.push(child1);
}

function generateRoom(
	node: PMDDungeonNodeData,
	roomMarginSize: number,
	minRoomSideLength: number
): PMDDungeonNodeRoom {
	const width =
		Math.random() * (node.width - roomMarginSize * 2 - minRoomSideLength) + minRoomSideLength;
	const height =
		Math.random() * (node.height - roomMarginSize * 2 - minRoomSideLength) + minRoomSideLength;

	return {
		x: node.x + roomMarginSize + Math.random() * (node.width - roomMarginSize * 2 - width),
		y: node.y + roomMarginSize + Math.random() * (node.height - roomMarginSize * 2 - height),
		width,
		height
	};
}
