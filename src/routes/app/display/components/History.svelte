<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/clients/dexie';

	type Record = {
		image: string;
		id: number;
		title: string;
		date: string;
		summary: string;
		facts: string[];
		questions: string[];
	};

	let record: Record | null = null;

	let interval: NodeJS.Timeout;

	// Function to fetch a random sentence and update base64 and text
	const fetchRandomSentence = async () => {
		record = await db.getRandomEvent();

		console.log(record);
	};

	onMount(() => {
		// Fetch initial random sentence
		fetchRandomSentence();

		// Rotate image every 20 seconds
		interval = setInterval(
			() => {
				fetchRandomSentence();
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
		<div class="max-h-[300px] flex-grow" style="background-image: url({record.image});">
			<img
				src={record.image}
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
