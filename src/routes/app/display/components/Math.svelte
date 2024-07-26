<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let math = {
		sign: '+',
		numbers: [6, 7, 13],
		hiding: [false, false, false],
		emoji: '😀'
	};

	//create an array of 20 kid friendly emojis, some smilies and some not

	const emojis = [
		'😀',
		'😁',
		'😂',
		'😃', // 4 smiley faces
		'🎉',
		'🎈',
		'🚀',
		'🌟',
		'🍎',
		'🍉',
		'🍦',
		'🎂',
		'🐶',
		'🐱',
		'🦄',
		'🐢',
		'🚗',
		'💋',
		'⚽️',
		'🏀'
	];

	const randomProblem = () => {
		math.hiding = [false, false, false];
		const num1 = Math.floor(Math.random() * 10) + 1;
		const num2 = Math.floor(Math.random() * 10) + 1;
		math.sign = Math.random() > 0.5 ? '+' : '-';

		let num3;
		if (math.sign === '-') {
			num3 = num1 >= num2 ? num1 - num2 : num2 - num1;
			math.numbers = num1 >= num2 ? [num1, num2, num3] : [num2, num1, num3];
		} else {
			num3 = num1 + num2;
			math.numbers = [num1, num2, num3];
		}

		math.hiding[Math.floor(Math.random() * 3)] = true;

		math.emoji = emojis[Math.floor(Math.random() * emojis.length)];

		console.log(math);
	};

	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		randomProblem();

		// Rotate image every 20 seconds
		interval = setInterval(
			async () => {
				randomProblem();
			},
			5 * 60 * 1000
		);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

<div class="w-full h-full">
	<div class="h-1/3 w-full p-2 flex flex-row">
		<div class="h-full w-1/12"></div>
		<div class="w-1/6 num">{math.hiding[0] ? '?' : math.numbers[0]}</div>
		<div class="h-full w-3/4 items">
			{math.hiding[0] ? '' : Array(math.numbers[0]).fill(math.emoji).join(' ')}
		</div>
	</div>
	<div class="h-1/3 w-full p-2 border-b-2 flex flex-row">
		<div class="h-full w-1/12 flex justify-center items-center text-3xl font-bold text-white">
			{math.sign}
		</div>
		<div class="w-1/6 num">{math.hiding[1] ? '?' : math.numbers[1]}</div>
		<div class="h-full w-3/4 items">
			{math.hiding[1] ? '' : Array(math.numbers[1]).fill(math.emoji).join(' ')}
		</div>
	</div>
	<div class="h-1/3 w-full p-2 flex flex-row">
		<div class="h-full w-1/12"></div>
		<div class="w-1/6 num">{math.hiding[2] ? '?' : math.numbers[2]}</div>
		<div class="h-full w-3/4 items">
			{math.hiding[2] ? '' : Array(math.numbers[2]).fill(math.emoji).join(' ')}
		</div>
	</div>
</div>

<style lang="postcss">
	.num {
		@apply flex items-center justify-center p-4 rounded-lg shadow text-4xl bg-slate-700 text-white;
	}

	.items {
		@apply text-white -tracking-tighter text-xl ml-4 flex items-center;
	}
</style>
