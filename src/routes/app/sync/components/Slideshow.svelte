<script lang="ts">
	import { db } from '$lib/clients/dexie';
	import axios from 'axios';
	import { lf } from '$lib/clients/localfiles';

	export let onNext: () => void;

	let button: HTMLButtonElement;
	let synced = 0;
	let total = 0;
	let pct = 0;

	const syncPhotos = async () => {
		// Delete everything from the photos table
		await db.photos.clear();
		console.log('syncing photos');
		button.disabled = true;

		const { data: photos } =
			await axios.get<{ created: string; url: string }[]>('/app/api/photos/list');

		const chunkSize = 10;
		total = photos.length;

		for (let i = 0; i < photos.length; i += chunkSize) {
			const chunk = photos.slice(i, i + chunkSize);

			// Process each chunk concurrently
			await Promise.all(
				chunk.map(async (photo, index) => {
					const { data: imageData } = await axios.post('/app/api/images/convert', {
						url: photo.url
					});

					const photoIndex = i + index;
					await db.photos.add({ id: photoIndex, created: photo.created, base64: imageData.base64 });
				})
			);

			synced += chunk.length;
		}

		button.disabled = false;
	};
</script>

<h1>Time to Sync Your Google Photos</h1>
<h3>We will keep your Marriot Board looking fresh!</h3>

<div class="col-span-3 bg-slate-300 w-full h-12 relative">
	<div class="absolute left-2 top-2 text-lg">
		{#if total > 0}
			{synced} / {total}
		{/if}
	</div>
	<div
		class="h-full bg-blue-500"
		style="width: {total === 0 ? 0 : Math.round((100 * synced) / total)}%"
	></div>
</div>
<button bind:this={button} on:click={syncPhotos}> Sync Google Photos</button>
<button on:click={onNext}>Next</button>

<style lang="postcss">
	button:disabled {
		@apply bg-black;
	}
</style>
