<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/clients/dexie';

	let image: string;
	let date: string;
	let interval: NodeJS.Timeout;

	// Function to fetch a random sentence and update base64 and text
	const fetchRandomPhoto = async () => {
		const randomRecord = await db.getRandomPhoto();
		image = randomRecord?.image || '';
		date = new Date(randomRecord?.created || '').toLocaleDateString();
	};

	onMount(() => {
		// Fetch initial random sentence
		fetchRandomPhoto();

		// Rotate image every 20 seconds
		interval = setInterval(() => {
			fetchRandomPhoto();
		}, 60 * 1000);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

<div class="h-full bg-cover relative" style="background-image: url('{image}');">
	<div
		class="absolute z-30 bottom-2 right-2 w-24 h-8 bg-black/80 rounded text-white flex justify-center items-center"
	>
		{date}
	</div>
	<img
		src={image}
		style="backdrop-filter: blur(20px);"
		alt="Alex"
		class="object-contain mx-auto border-[2px] rounded-lg h-full w-full shadow-inner"
	/>
</div>

<style>
	/* Add your styles here */
</style>
