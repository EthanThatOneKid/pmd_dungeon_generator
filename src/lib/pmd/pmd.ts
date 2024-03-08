import type { DungeonTree, DungeonTreeNode } from './tree';
import { eachLeaf, walkTree } from './tree';

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
	tree.leaves.push(tree.root);

	// While there are leaves to split, split them.
	let hasLeaves = true;
	while (hasLeaves) {
		hasLeaves = eachLeaf(tree, (node) => {
			if (!maySplit(node.data, options.minNodeSideLength)) {
				return;
			}

			// Split the node.
			split(node);
		});
	}

	// Create a room with random size in each leaf of the tree.
	eachLeaf(tree, (node) => {
		node.data.room = generateRoom(node.data, options.roomMarginSize, options.minRoomSideLength);
	});

	// Create corridors between rooms.
	walkTree(tree.root, (node) => {
		// Create corridor between children.
		const corridor = generateCorridor(node, 2);
		if (corridor) {
			node.data.corridor = corridor;
		}
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
	corridor?: PMDDungeonNodeRoom;
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

function generateCorridor(
	node: DungeonTreeNode<PMDDungeonNodeData>,
	corridorSize: number
): PMDDungeonNodeRoom | undefined {
	const child0 = node.children[0];
	const child1 = node.children[1];
	if (child0 === undefined || child1 === undefined) {
		return;
	}

	const leaves0 = leavesOf(child0);
	const leaves1 = leavesOf(child1);
	const [room0, room1] = findClosestRooms(leaves0, leaves1);

	// Create a new room that connects the two rooms.
	const corridorX = room0.x + room0.height;
	const corridorY = Math.random() * (room0.y + room0.height - corridorSize - room1.y) + room1.y;
	return {
		x: corridorX,
		y: corridorY,
		width: room1.x - corridorX,
		height: corridorSize
	};
}

function findClosestRooms(
	leaves0: DungeonTreeNode<PMDDungeonNodeData>[],
	leaves1: DungeonTreeNode<PMDDungeonNodeData>[]
): [PMDDungeonNodeRoom, PMDDungeonNodeRoom] {
	let minDistance = Infinity;
	let room0: PMDDungeonNodeRoom | undefined;
	let room1: PMDDungeonNodeRoom | undefined;
	for (const leaf0 of leaves0) {
		for (const leaf1 of leaves1) {
			if (leaf0.data.room === undefined || leaf1.data.room === undefined) {
				continue;
			}

			if (
				leaf0.data.room.y + leaf0.data.room.height < leaf1.data.room.y ||
				leaf0.data.room.y > leaf1.data.room.y + leaf1.data.room.height ||
				leaf0.data.room.x + leaf0.data.room.width > leaf1.data.room.x
			) {
				continue;
			}

			const distanceX = Math.min(
				Math.abs(leaf1.data.room.x - leaf0.data.room.x + leaf0.data.room.width),
				Math.abs(leaf0.data.room.x - leaf1.data.room.x + leaf1.data.room.width)
			);
			const distanceY = Math.min(
				Math.abs(leaf1.data.room.y - leaf0.data.room.y + leaf0.data.room.height),
				Math.abs(leaf0.data.room.y - leaf1.data.room.y + leaf1.data.room.height)
			);

			const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
			if (distance < minDistance) {
				minDistance = distance;
				room0 = leaf0.data.room;
				room1 = leaf1.data.room;
			}
		}
	}

	if (room0 === undefined || room1 === undefined) {
		throw new Error('no rooms found');
	}

	return [room0, room1];
}

function leavesOf(
	node: DungeonTreeNode<PMDDungeonNodeData>
): DungeonTreeNode<PMDDungeonNodeData>[] {
	const leaves: DungeonTreeNode<PMDDungeonNodeData>[] = [];
	if (node.children.length === 0) {
		leaves.push(node);
	} else {
		for (const child of node.children) {
			leaves.push(...leavesOf(child));
		}
	}

	return leaves;
}
