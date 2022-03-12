<!--
TODO:
 - Better alt for img
 - Fix out-of-board shadow bug
 - Add logic
 - Piece/movement history
-->
<script>
	import { onMount } from 'svelte';
	import { strToArrayOfSquares } from './fenParser.ts';

	export let size = 16,
		squareSize = 42,
		position = null;

	const PIECES = Object.values(import.meta.globEager('./assets/pieces/*.{png,svg,jpg}')).map(
		(e) => e.default
	);
	$: buildState = position == null ? [...Array(size * size)] : strToArrayOfSquares(position);

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
	let scrollable = true;

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
			// https://github.com/bevacqua/dragula/issues/487#issuecomment-383857371
			'touchmove',
			function (e) {
				if (!scrollable) e.preventDefault();
			},
			{ passive: false }
		);

		let drake = dragula.default(containers, {
			copy: function (element, source) {
				// Only copy if it's coming from the tray
				return source.id == 'piece-tray';
			},
			removeOnSpill: true,
			ignoreInputTextSelection: true,
			mirrorContainer: chessboard.querySelector('#trash'),
			// TODO: Add Chess logic to moves() and accepts()
			accepts: function (el, target, source, sibling) {
				return target.classList.contains('square');
			}
		});
		drake.on('drag', function () {
			scrollable = false;
		});
		drake.on('dragend', function () {
			scrollable = true;
		});
		drake.on('drop', (el, target, source, sibling) => {
			// IMPLEMENT MOVEMENT HISTORY HERE
			if (target.children.length > 1) {
				target.removeChild(sibling);
			}
			let output = [];
			chessboard.querySelectorAll('.square').forEach(function (e) {
				let img = e.querySelector('img');
				if (img === null) {
					if (typeof output[output.length - 1] === 'number') {
						output[output.length - 1] += 1;
					} else {
						output.push(1);
					}
				} else {
					output.push(img.getAttribute('data-piece'));
				}
			});
			position = `${size} ` + output.join('');
		});
	});
</script>

<div bind:this={chessboard}>
	<div class="pt-2">
		{#each RANKS as rank}
			<div data-rank={rank} class="rank">
				{#each FILES as file, i}
					{@const buildMe = buildState[size * (size - rank) + i]}
					<div
						id="{file}{rank}"
						class:bg-peach={i % 2 == rank % 2}
						class:bg-brown={i % 2 != rank % 2}
						class="square"
					>
						{#if buildMe != undefined}
							<img
								alt="A chess piece"
								data-piece={buildMe.san}
								src={buildMe.src}
								class="inline-block piece"
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="flex flex-wrap before:content-[''] before:pr-8">
		{#each FILES as file}<span class="label">{file}</span>{/each}
	</div>
	<div id="piece-tray" class="p-3">
		{#each PIECES as piece}
			<img alt="A chess piece" src={piece} class="inline-block piece" />
		{/each}
	</div>
	<div id="trash" />
</div>

<style>
	img {
		user-select: none;
	}
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

	.label {
		display: inline-block;
		padding: calc(var(--size) / var(--dimension));
		width: var(--size);
		text-align: center;
	}

	.piece {
		width: var(--size);
	}
</style>
