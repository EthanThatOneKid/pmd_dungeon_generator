<script lang="ts">
	import Pmd from '$lib/components/pmd.svelte';
</script>

<svelte:head>
	<title>Binary space partitioning</title>
	<link rel="icon" type="image/svg+xml" href="/demo.svg" />
	<meta property="og:title" content="Binary space partitioning" />
	<meta property="og:type" content="website" />
	<meta
		name="description"
		content="Visual representation of a binary space partitioning (BSP) tree"
	/>
	<meta
		name="og:image"
		content="https://github.com/EthanThatOneKid/pmd_dungeon_generator/raw/main/static/demo.svg"
	/>
	<link
		rel="stylesheet"
		type="text/css"
		href="https://ethanthatonekid.github.io/dropin-minimal-css/min/w3c-chocolate.min.css"
	/>
</svelte:head>

<h1>Binary space partitioning</h1>

<h2>Description</h2>

<p>
	Binary space partitioning (BSP) is a method for recursively subdividing a space into convex sets
	by hyperplanes. This subdivision gives rise to a representation of the scene by means of a tree
	data structure known as a BSP tree. See the <a
		href="https://github.com/EthanThatOneKid/pmd_dungeon_generator/blob/main/src/lib/pmd/pmd.ts"
		>TypeScript implementation</a
	> of the algorithm.
</p>

<h2>References</h2>

<ul>
	<li>
		<a href="https://en.wikipedia.org/wiki/Binary_space_partitioning"
			>Wikipedia: Binary space partitioning</a
		>
	</li>
	<li>
		<a href="https://www.roguebasin.com/index.php?title=Basic_BSP_Dungeon_generation"
			>RoguelikeBasin: Basic BSP Dungeon generation</a
		>
	</li>
	<li>
		<a href="https://www.youtube.com/watch?v=S5y3ES4Rvkk">YouTube: Binary Tree</a>
	</li>
</ul>

<Pmd />
