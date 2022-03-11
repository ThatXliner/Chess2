<svelte:head>
<!-- Primary Meta Tags -->

<title>Chess 2 — Command. Control. Conquer.</title>
<meta name="title" content="Chess 2 — Command. Control. Conquer.">
<meta name="description" content="We have took it in our own hands to update chess. Introducing Chess 2, a novel twist to the thousand-year-old game. With fascinating new pieces like the wizard and giant, you are sure to have fun playing this remix.">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="Chess 2 — Command. Control. Conquer.">
<meta property="og:description" content="We have took it in our own hands to update chess. Introducing Chess 2, a novel twist to the thousand-year-old game. With fascinating new pieces like the wizard and giant, you are sure to have fun playing this remix.">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="Chess 2 — Command. Control. Conquer.">
<meta property="twitter:description" content="We have took it in our own hands to update chess. Introducing Chess 2, a novel twist to the thousand-year-old game. With fascinating new pieces like the wizard and giant, you are sure to have fun playing this remix.">
</svelte:head>
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
	<div class="pb-2 pl-3">
		<label for="size">Chessboard size:</label>
		<input class="input max-w-sm" id="size" type="number" bind:value={size} min="1" max="26" />
	</div>
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
	<footer class="p-5 text-center">
		Made with <i>&#10084;</i> by
		<a class="text-blue-400" href="https://github.com/ThatXliner"> @ThatXliner</a>
	</footer>
</main>
