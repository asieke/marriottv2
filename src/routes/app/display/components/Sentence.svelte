<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db, type Sentence } from '$lib/clients/dexie';

	let interval: NodeJS.Timeout;
	let record: Sentence | null = null;

	onMount(async () => {
		// Fetch initial random sentence
		record = await db.getRandomSentence();

		// Rotate image every 20 seconds
		interval = setInterval(
			async () => {
				record = await db.getRandomSentence();
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
	<div class="text-white grid grid-cols-2 gap-4">
		<img
			src={record.base64}
			alt="sentence"
			class="w-full h-full border-[2px] shadow-md rounded-lg"
		/>
		<div class="flex align-middle justify-center items-center text-center">
			<h1 class="text-3xl leading-normal">{record.text}</h1>
		</div>
	</div>
{/if}

<style>
	/* Add your styles here */
</style>
