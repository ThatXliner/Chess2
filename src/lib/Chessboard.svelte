<!--
TODO:
 - Better alt for img
 - Fix out-of-board shadow bug
 - Use more Tailwind
-->
<script>
	import { onMount } from 'svelte';

	export let size = 16,
		squareSize = 42,
		boardPos = '';

	let buildState = [];
	if (boardPos.length > 0) {
		for (let i = 0; i < boardPos.length - 1; i++) {
			if (boardPos[i] == '-') continue;
			buildState.push(
				Object.keys(import.meta.glob(`./assets/pieces/${boardPos[i] + boardPos[i + 1]}.*`))[0]
			);
		}
	}

	if (size > 26) {
		throw new Error('Size is too big (must be between 1 and 26)');
	}
	if (size < 1) {
		throw new Error('Size is too small (must be between 1 and 26)');
	}

	const PIECES = Object.keys(import.meta.glob('./assets/pieces/*.{png,svg,jpg}'));

	const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$: RANKS = Array(size)
		.fill()
		.map((_, i) => i + 1)
		.reverse();
	$: FILES = Array(size)
		.fill()
		.map((_, i) => ALPHABET[i]);

	let chessboard;

	onMount(async () => {
		chessboard.style.setProperty('--size', `${squareSize}px`);
		chessboard.style.setProperty('--dimension', `${size}`);
		window.global = window.globalThis || window; // Required polyfill for dragula

		const dragula = await import('dragula');
		let containers = [chessboard.querySelector('#piece-tray')];
		chessboard.querySelectorAll('.square').forEach((e) => {
			containers.push(e);
		});
		let drake = dragula.default(containers, {
			copy: function (element, source) {
				return source.id == 'piece-tray';
			},
			removeOnSpill: true,
			direction: 'horizontal',
			ignoreInputTextSelection: true,
			mirrorContainer: chessboard.querySelector('#trash'),
			accepts: function (el, target, source, sibling) {
				return target.classList.contains('square');
			}
		});
		drake.on('drop', (el, target, source, sibling) => {
			if (target.children.length > 1) {
				target.removeChild(target.children[1]);
			}
		});
	});
</script>

<div bind:this={chessboard}>
	<div>
		{#each RANKS as rank}
			<div data-rank={rank} class="rank">
				{#each FILES as file, i}
					<div
						id="{file}{rank}"
						class:light-square={i % 2 == rank % 2}
						class:dark-square={i % 2 != rank % 2}
						class="square"
					>
						{#if buildState.length > 0 && buildState[0] != '-'}
							<img
								alt="A chess piece"
								src="/src/lib/{buildState.shift()}"
								class="inline-block piece"
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="file-labels">
		{#each FILES as file}<span>{file}</span>{/each}
	</div>
	<div id="piece-tray">
		{#each PIECES as piece}
			<img alt="A chess piece" src="/src/lib/{piece.slice(2)}" class="inline-block piece" />
		{/each}
	</div>
	<div id="trash" />
</div>

<style>
	.rank::before {
		content: attr(data-rank);
		width: 2rem;
		text-align: center;
	}
	.rank {
		display: flex;
	}

	.square {
		width: var(--size);
		height: var(--size);
	}
	.square:hover {
		border-color: black;
		border-width: 2px;
	}
	.light-square {
		background-color: #f0d9b5;
	}
	.dark-square {
		background-color: #b58863;
	}
	.file-labels {
		display: flex;
		flex-wrap: wrap;
	}
	.file-labels::before {
		content: '';
		padding-right: 2rem;
	}
	.file-labels > span {
		display: inline-block;
		padding: calc(var(--size) / var(--dimension));
		width: var(--size);
		text-align: center;
	}

	.piece {
		width: var(--size);
	}
</style>
