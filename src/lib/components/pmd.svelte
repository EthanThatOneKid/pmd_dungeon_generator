<script lang="ts">
	import type { PMDDungeon } from '$lib/pmd';
	import { generateDungeon } from '$lib/pmd';
	import { stringify } from '$lib/json_circular';

	let dungeon: PMDDungeon; // Type of the return value of the

	function randomize() {
		dungeon = generateDungeon({
			width: 100,
			height: 100,
			minNodeSideLength: 20,
			roomMarginSize: 2,
			minRoomSideLength: 10
		});
	}

	randomize();
</script>

<svg
	viewBox="0 0 {dungeon.root?.data.width} {dungeon.root?.data.height}"
	width="100%"
	height="100%"
>
	{#each dungeon.leaves as leaf}
		<rect
			x={leaf.data.x}
			y={leaf.data.y}
			width={leaf.data.width}
			height={leaf.data.height}
			fill="none"
			stroke="black"
		/>
		{#if leaf.data.room !== undefined}
			<rect
				x={leaf.data.room.x}
				y={leaf.data.room.y}
				width={leaf.data.room.width}
				height={leaf.data.room.height}
				fill="black"
				stroke="red"
			/>
		{/if}
	{/each}
</svg>

<button on:click={() => randomize()}>Randomize</button>

<details>
	<summary>JSON data</summary>

	<pre><code>{stringify(dungeon, 2)}</code></pre>
</details>
