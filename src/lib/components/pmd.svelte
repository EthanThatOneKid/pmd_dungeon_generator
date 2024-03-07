<script lang="ts">
	import type { PMDDungeon } from '$lib/pmd';
	import { generatePMDDungeon } from '$lib/pmd';
	import { stringify } from '$lib/json_circular';

	let dungeon: PMDDungeon; // Type of the return value of the

	function randomize() {
		dungeon = generatePMDDungeon({
			width: 100,
			height: 100,
			minRoomSideLength: 20
		});
	}

	randomize();
</script>

<svg
	viewBox="0 0 {dungeon.root?.data.width} {dungeon.root?.data.height}"
	width="100%"
	height="100%"
>
	{#each dungeon.leaves as room}
		<rect
			x={room.data.x}
			y={room.data.y}
			width={room.data.width}
			height={room.data.height}
			fill="none"
			stroke="black"
		/>
	{/each}
</svg>

<button on:click={() => randomize()}>Randomize</button>

<details>
	<summary>JSON data</summary>

	<pre><code>{stringify(dungeon, 2)}</code></pre>
</details>
