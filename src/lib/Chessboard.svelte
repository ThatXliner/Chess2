<!--
TODO:
 - Better alt for img
 - Fix out-of-board shadow bug
 - Use more Tailwind
 - Add logic
 - ~~Fix moving e pawn bug (debug FEN)~~ TEMP FIX!
-->
<script>
	import { onMount } from 'svelte';
	import { fenToArrayOfSquares } from './fenParser.ts';

	export let size = 16,
		squareSize = 42,
		boardState = null;
	const PIECES = Object.values(import.meta.globEager('./assets/pieces/*.{png,svg,jpg}')).map(
		(e) => e.default
	);
	const buildState = fenToArrayOfSquares(
		boardState ?? `${size}/`.repeat(size).slice(0, -1) + ' w KQkq - 0 1'
	);

	if (size > 26) {
		throw new Error('Size is too big (must be between 1 and 26)');
	}
	if (size < 1) {
		throw new Error('Size is too small (must be between 1 and 26)');
	}

	const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$: RANKS = Array.from(Array(size).keys())
		.map((_, i) => i + 1)
		.reverse();
	$: FILES = Array.from(Array(size).keys()).map((_, i) => ALPHABET[i]);

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
		document.addEventListener(
			'touchmove',
			function (e) {
				e.preventDefault();
			},
			{ passive: false }
		); // https://github.com/bevacqua/dragula/issues/487#issuecomment-383857371
		let drake = dragula.default(containers, {
			copy: function (element, source) {
				return source.id == 'piece-tray';
			},
			removeOnSpill: true,
			ignoreInputTextSelection: true,
			mirrorContainer: chessboard.querySelector('#trash'),
			accepts: function (el, target, source, sibling) {
				return target.classList.contains('square');
			}
		});
		drake.on('drop', (el, target, source, sibling) => {
			if (target.children.length > 1) {
				target.removeChild(sibling);
			}
			boardState = null;
			// let buildBoardState = [];
			// chessboard.querySelectorAll('.rank').forEach((rank) => {
			// 	let temp = [];
			// 	rank.querySelectorAll('.square').forEach((square) => {
			// 		let img = square.querySelector('img');
			// 		if (img == undefined) {
			// 			if (typeof temp[temp.length - 1] === 'number') {
			// 				temp[temp.length - 1] += 1;
			// 			} else {
			// 				temp.push(1);
			// 			}
			// 		} else {
			// 			temp.push(img.getAttribute('data-piece'));
			// 		}
			// 	});
			// 	buildBoardState.push(temp.join(''));
			// });
			// boardState = buildBoardState.join('/') + ' w KQkq - 0 1';
		});
	});
</script>

<div bind:this={chessboard}>
	<div class="pt-2">
		{#each RANKS as rank}
			<div data-rank={rank} class="rank">
				{#each FILES as file, i}
					{@const buildMe = buildState.shift()}
					<div
						id="{file}{rank}"
						class:light-square={i % 2 == rank % 2}
						class:dark-square={i % 2 != rank % 2}
						class="square"
					>
						{#if buildMe != undefined}
							<img
								alt="A chess piece"
								data-piece={buildMe.sen}
								src={buildMe.src}
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
			<img alt="A chess piece" src={piece} class="inline-block piece" />
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
