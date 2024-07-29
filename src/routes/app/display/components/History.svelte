<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db, type Event } from '$lib/clients/dexie';

	let record: Event | null = null;

	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		record = await db.getRandomEvent();

		interval = setInterval(
			async () => {
				record = await db.getRandomEvent();
			},
			5 * 60 * 1000
		);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

{#if record}
	<div class="flex flex-col h-full space-y-3">
		<div class="max-h-[300px] flex-grow" style="background-image: url({record.base64});">
			<img
				src={record.base64}
				style="backdrop-filter: blur(10px);"
				alt="Alex"
				class="object-contain mx-auto border-[2px] rounded-lg h-full w-full shadow-lg"
			/>
		</div>
		<div class="flex flex-col flex-grow p-2 gap-3 text-white overflow-hidden relative">
			<p class="text-xl leading-relaxed">{record.summary}</p>
			<ol class="list-decimal pl-5 space-y-2 text-xl mt-2">
				{#each record.facts.slice(0, 2) as fact}
					<li>{fact}</li>
				{/each}
			</ol>

			<div class="absolute w-full bottom-0 bg-pink-600/80 rounded space-y-2 text-center p-5">
				<p class="text-2xl">{record.questions[0]}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Add your styles here */
</style>
