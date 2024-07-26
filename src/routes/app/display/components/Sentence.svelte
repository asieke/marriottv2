<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/clients/dexie';

	let image: string;
	let text: string;
	let interval: NodeJS.Timeout;

	// Function to fetch a random sentence and update base64 and text
	const fetchRandomSentence = async () => {
		const randomRecord = await db.getRandomSentence();
		image = randomRecord?.image || '';
		text = randomRecord?.text || '';
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

<div class="text-white grid grid-cols-2 gap-4">
	<img src={image} alt="sentence" class="w-full h-full border-[2px] shadow-md rounded-lg" />
	<div class="flex align-middle justify-center items-center text-center">
		<h1 class="text-3xl leading-normal">{text}</h1>
	</div>
</div>

<style>
	/* Add your styles here */
</style>
