<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { db, type Art, type Artist } from '$lib/clients/dexie';

	let art: Art | null = null;
	let artist: Artist | null = null;

	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		({ art, artist } = await db.getRandomArt());

		// Rotate image every 20 seconds
		interval = setInterval(async () => {
			({ art, artist } = await db.getRandomArt());
		}, 20 * 1000);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

{#if art && artist}
	<div class="flex flex-col h-full space-y-3">
		<div class="max-h-[460px] flex-grow" style="background-image: url({art.base64});">
			<img
				src={art.base64}
				style="backdrop-filter: blur(10px);"
				alt="Alex"
				class="object-contain mx-auto border-[2px] rounded-lg h-full w-full shadow-lg"
			/>
		</div>
		<div class="flex flex-col flex-grow p-2 gap-3 text-white overflow-hidden">
			<div class="flex">
				<div class="w-1/3">
					<img class="rounded-md shadow-md" src={artist.base64} alt={artist.name} />
				</div>
				<div class="w-2/3 pl-3">
					<h1 class="text-xl font-bold">{art.title}</h1>
					<h2 class="text-xl">{artist.name}</h2>
					<h3 class="text-lg">
						{artist.region}
						{artist.start_year} - {artist.end_year}
					</h3>
				</div>
			</div>
			<div class="flex-grow">
				<p class="text-sm p-2">{artist.short_description}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Add your styles here */
</style>
