<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db, type Photo } from '$lib/clients/dexie';

	let photo: Photo | null = null;
	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		photo = await db.getRandomPhoto();

		// Rotate image every 20 seconds
		interval = setInterval(async () => {
			photo = await db.getRandomPhoto();
		}, 60 * 1000);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

{#if photo}
	<div class="h-full bg-cover relative" style="background-image: url('{photo.base64}');">
		<div
			class="absolute z-30 bottom-2 right-2 w-24 h-8 bg-black/80 rounded text-white flex justify-center items-center"
		>
			{photo.created}
		</div>
		<img
			src={photo.base64}
			style="backdrop-filter: blur(20px);"
			alt="Alex"
			class="object-contain mx-auto border-[2px] rounded-lg h-full w-full shadow-inner"
		/>
	</div>
{/if}

<style>
	/* Add your styles here */
</style>
