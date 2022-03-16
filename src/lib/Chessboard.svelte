<!--
TODO:
 - Better alt for img
 - Fix out-of-board shadow bug
 - Add logic
 - Piece/movement history
-->
<script>
	import { onMount } from 'svelte';
	import { convert } from './parser.ts';

	export let size = 16,
		squareSize = 42,
		position = null,
		history = [];

	const PIECES = Object.entries(import.meta.globEager('./assets/pieces/*.{png,svg,jpg}')).map(
		([k, v]) => {
			let name = k.match(/(\w+)\.\w+$/)[1]
			return { src: v.default, san: name[0] === "w" ? name[1].toUpperCase() : name[1].toLowerCase() }
		}
	);
	$: if (position === null) {position = `${size} ${size * size}`}
	$: buildState = convert(position);

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

	function addToHistory(item) {
		let last = history[history.length - 1];
		if (Array.isArray(last) && last.length == 1) {
			history = [...history.slice(0, -1), [last[0], item]];
		} else {
			history = [...history, [item]];
		}
	}

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
			mirrorContainer: chessboard.querySelector('#trash'),
			// TODO: Add Chess logic to moves() and accepts()
			// Also change so trash is a container if:
			//   Make removeOnSpill false and revertOnSpill true
			//   That way we can use dragula.cancel in on=>drop??
			// - Only if ^ works
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
			// TODO Figure history thing for giant
			if (target.children.length > 1) {
				target.removeChild(sibling);
				//if (el === null) return;
				//if (el.getAttribute('data-piece').toLowerCase() == 'p') {
				//	addToHistory(`${source.id[0].toLowerCase()}x${target.id.toLowerCase()}`);
				//} else {
				//	addToHistory(
				//		`${el
				//			.getAttribute('data-piece')
				//			.toUpperCase()}${source.id.toLowerCase()}x${target.id.toLowerCase()}`
				//	);
				//}
			}
			//if (el !== null) {
			//	if (el.getAttribute('data-piece').toLowerCase() == 'p') {
			//		addToHistory(target.id.toLowerCase());
			//	} else {
			//		addToHistory(`${el.getAttribute('data-piece').toUpperCase()}${target.id.toLowerCase()}`);
			//	}
			//}
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
							<div>
								<img
									alt="A chess piece"
									data-piece={buildMe.san}
									src={buildMe.src}
									class="inline-block piece"
								/>
							</div>
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
		    <div><img alt="A chess piece" data-piece={piece.san} src={piece.src} class="inline-block piece" /></div>
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
