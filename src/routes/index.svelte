<script>
	import Chessboard from '$lib/Chessboard.svelte';
	let size = 16;
	$: if (size > 26) {size = 26}
	const INITIAL_POSITION = `${size} rabnljwqkwjlnbarppppggppppggpppp4gg4gg168GG4GG4PPPPGGPPPPGGPPPPRABNLJWQKWJLNBAR`;
	let position = INITIAL_POSITION;
	let history = [];
</script>

<svelte:head>
	<!-- Primary Meta Tags. TODO: use svelte-seo -->

	<title>Chess 2 — Command. Control. Conquer.</title>
	<meta name="title" content="Chess 2 — Command. Control. Conquer." />
	<meta
		name="description"
		content="We have took it in our own hands to update chess. Introducing Chess 2, a novel twist to the thousand-year-old game. With fascinating new pieces like the wizard and giant, you are sure to have fun playing this remix."
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Chess 2 — Command. Control. Conquer." />
	<meta
		property="og:description"
		content="We have took it in our own hands to update chess. Introducing Chess 2, a novel twist to the thousand-year-old game. With fascinating new pieces like the wizard and giant, you are sure to have fun playing this remix."
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="Chess 2 — Command. Control. Conquer." />
	<meta
		property="twitter:description"
		content="We have took it in our own hands to update chess. Introducing Chess 2, a novel twist to the thousand-year-old game. With fascinating new pieces like the wizard and giant, you are sure to have fun playing this remix."
	/>
</svelte:head>

<main>
	<div class="flex justify-center w-full pt-3">
		<Chessboard {size} bind:position bind:history />
		<ol class="float-right" class:list-decimal={history.length > 0}>
			{#each history as item}
				<li>{item[0]} {item[1] ?? '...'}</li>
			{:else}
				<li>No items</li>
			{/each}
		</ol>
	</div>
	<div class="pb-2 pl-3">
		<label for="size">Chessboard size:</label>
		<input class="input max-w-sm" id="size" type="number" bind:value={size} min="1" max="26" />
	</div>
	<br />
	<div class="pl-1">
		<button
			class="button"
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
		<button
			class="button is-primary"
			on:click={() => {
				navigator.clipboard.writeText(position).then(
					function () {
						window.alert('Copied to clipboard');
					},
					function (err) {
						window.alert('Could not copy to clipboard');
					}
				);
			}}>Save board position</button
		>
	</div>

	<footer class="p-5 text-center">
		Made with <i>&#10084;</i> by
		<a class="text-link" href="https://github.com/ThatXliner"> @ThatXliner</a> |
		<a class="text-link" href="https://github.com/ThatXliner/chess2">Github Repository</a>
	</footer>
</main>
