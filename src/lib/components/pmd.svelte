<script lang="ts">
	import { DungeonTree } from '$lib/pmd';

	// Usage example
	const tree = new DungeonTree();
	const rootNode = tree.addNode(null, false, null);
	const leftNode = tree.addNode(rootNode, true, { size: 10, location: [10, 10] });
	const rightNode = tree.addNode(rootNode, true, { size: 15, location: [20, 10] });

	console.log({ tree, leftNode, rightNode });

	// https://www.youtube.com/watch?v=S5y3ES4Rvkk
</script>

<pre><code>
  Hello world!
</code></pre>
