<script>
	import Chessboard from '$lib/Chessboard.svelte';
	let size = 16;
	const INITIAL_POSITION =
		'rabnljwqkwjlnbar/ppppggppppggpppp/4gg4gg4/' +
		'16/16/16/16/16/16/16/16/16/16/' +
		'4GG4GG4/PPPPGGPPPPGGPPPP/RABNLJWQKWJLNBAR' +
		' w KQkq - 0 1';
	let position = INITIAL_POSITION;
</script>

<main>
	<Chessboard {size} bind:boardState={position} />
	<label for="size">Chessboard size:</label>
	<input class="input max-w-sm" id="size" type="number" bind:value={size} min=1 max=26 />
	<br />
	<button
		class="button is-primary"
		on:click={() => {
			position = INITIAL_POSITION;
		}}>Initial position</button
	>
	<button
		class="button is-danger"
		on:click={() => {
			position = null;
		}}>Clear board</button
	>
</main>
