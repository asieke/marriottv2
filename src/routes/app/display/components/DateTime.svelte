<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const getDate = () => {
		const date = new Date();
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	};

	let displayDate = getDate();
	export let showHours = true,
		showMinutes = true,
		showSeconds = true,
		date: Date | null = null;

	$: segmentsCount = Number(showHours) + Number(showMinutes) + Number(showSeconds);

	let interval: ReturnType<typeof setInterval>,
		display = new Array(Number(showHours) + Number(showMinutes) + Number(showSeconds)).fill({
			top: '00',
			bottom: '00',
			transition: false
		});

	const convert24hrTo12hr = (hours: number) => {
		if (hours === 0) return 12;
		if (hours > 12) return hours - 12;
		return hours;
	};

	onMount(
		() =>
			(interval = setInterval(() => {
				displayDate = getDate();
				const myDate = date || new Date();
				const newData: string[] = [];
				if (showHours)
					newData.push(convert24hrTo12hr(myDate.getHours()).toString().padStart(2, '0'));
				if (showMinutes) newData.push(myDate.getMinutes().toString().padStart(2, '0'));
				if (showSeconds) newData.push(myDate.getSeconds().toString().padStart(2, '0'));
				display = display.map(({ bottom }, i) => ({
					top: newData[i],
					bottom,
					transition: newData[i] !== bottom
				}));
				setTimeout(
					() =>
						(display = display.map(({ top }, i) => ({
							bottom: newData[i],
							top,
							transition: false
						}))),
					500
				);
			}, 1000))
	);
	onDestroy(() => interval && clearInterval(interval));
</script>

<h1 class="font-mono text-white w-full p-4 pb-8 text-2xl font-semibold">{displayDate}</h1>
<div class="clock" style="font-size:4em;">
	<div class="absolute text-white font-bold top-0 left-[97px] z-40" style="font-size:1em;">:</div>
	<div class="absolute text-white font-bold top-0 left-[216px] z-40" style="font-size:1em;">:</div>
	<div
		class="absolute text-white text-3xl font-bold top-[24px] left-[340px] flex items-center rounded-lg z-40 w-16 p-2 h-16 bg-yellow-400"
		style="background-color: #383838;"
	>
		<!-- If its pm then show pm, else am	 -->
		{new Date().getHours() >= 12 ? 'PM' : 'AM'}
	</div>
	<div class="overlay">
		{#each display as segment, i}
			<div class="segment">
				<p class="top" class:transition={segment.transition}>
					<span>
						{segment.bottom}
					</span>
				</p>
				<p class="bottom" class:transition={segment.transition}>
					<span>
						{segment.top}
					</span>
				</p>
			</div>
		{/each}
	</div>
	<div class="base">
		{#each display as segment}
			<div class="segment">
				<p class="top">
					{segment.top}
				</p>
				<p class="bottom">
					{segment.bottom}
				</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.clock {
		margin-left: 10px;
		position: relative;
		height: 1.51em;
	}
	.base,
	.overlay {
		display: flex;
		gap: 0em;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}
	.overlay .bottom {
		transform: scaleY(0);
	}
	.base p {
		border-radius: 0.25em;
	}
	.segment {
		position: relative;
		color: white;
		margin-right: 0.2ch;
		width: calc(2ch + 0.5em);
	}
	.segment p {
		background: #383838;
		padding: 0.2ch;
		width: 2.4ch;
		text-align: center;
	}
	.segment .top {
		border-radius: 0.25em 0.25em 0 0;
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		clip-path: inset(0px 0px 50% 0px);
	}
	.segment .top.transition {
		transition: transform 0.25s ease-in;
		transform: scaleY(0);
	}
	.segment .bottom {
		border-radius: 0 0 0.25em 0.25em;
		clip-path: inset(50% 0px 0px 0px);
		top: 0.01em;
		left: 0;
		position: absolute;
		margin: 0;
	}
	.segment .bottom.transition {
		transition: transform 0.25s 0.25s ease-out;
		transform: scale(100%);
	}
</style>
