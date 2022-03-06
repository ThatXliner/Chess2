<script>
	import Chessboard from '$lib/Chessboard.svelte';
	let size = 16;
</script>

<main>
	<Chessboard bind:size />
	<br />
	<hr />
	<label for="size">Chessboard size:</label>
	<input id="size" type="number" bind:value={size} class="m-5 p-2 outline bg-slate-200" />
</main>
