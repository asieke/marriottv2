<script lang="ts">
	import { page } from '$app/stores';
	import { db, type Artist } from '$lib/clients/dexie';
	import { downloadBase64File } from '$lib/utils/files';
	import { onMount } from 'svelte';
	import type { Tables } from '$lib/types/database.types';
	import { lf } from '$lib/clients/localfiles';

	export let onNext: () => void;

	const {
		data: { supabase }
	} = $page;

	let button: HTMLButtonElement;
	let artistCount = 0;
	let artCount = 0;
	let synced = 0;
	let pct = 0;

	onMount(async () => {
		const [count1, count2] = await Promise.all([
			supabase.rpc('count_art_popular'),
			supabase.rpc('count_artists')
		]);

		// Extract the data from the results
		artCount = count1.data;
		artistCount = count2.data;
	});

	const syncArtists = async () => {
		console.log('[START] - syncing artists');

		await db.artists.clear();

		const chunk = 100;
		const t1 = new Date().getTime();

		for (let i = 0; i < artistCount; i += chunk) {
			const { data } = (await supabase
				.from('artists')
				.select(
					'id, name, description, short_description, category, region, start_year, end_year, base64'
				)
				.order('id')
				.range(i, i + chunk - 1)) as { data: Tables<'artists'>[] };

			if (data) {
				await db.artists.bulkAdd(data);
			}
			synced += Math.min(chunk, artistCount - i);
			console.log('synced ', i + chunk, 'of', artistCount);
		}
		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Artists.  Time Taken: ', t2 - t1);
	};

	const syncArt = async () => {
		await syncArtists();
		console.log('[START] - syncing art');

		await db.arts.clear();

		const chunk = 100;
		const t1 = new Date().getTime();

		for (let i = 0; i < artCount; i += chunk) {
			const { data } = (await supabase
				.from('arts')
				.select('id, artist_id, title, category, base64')
				.order('id')
				.range(i, i + chunk - 1)) as { data: Tables<'arts'>[] };

			if (data) {
				try {
					await db.arts.bulkAdd(data);
				} catch (e) {
					console.error(e);
				}
			}
			synced += Math.min(chunk, artCount - i);
			console.log('synced ', i + chunk, 'of', artCount);
		}
		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Art.  Time Taken: ', t2 - t1);
	};
</script>

<h1>Time to Sync Some Artwork</h1>
<h3>We will keep your Marriot Board looking fresh!</h3>

<h4>{synced} / {artCount + artistCount}</h4>

<div class="col-span-3 bg-slate-300 w-full h-12">
	<div
		class="h-full bg-blue-500"
		style="width: {Math.round((100 * synced) / (artCount + artistCount))}%"
	></div>
</div>

<button bind:this={button} on:click={syncArt}> Sync Art</button>
<button on:click={onNext}>Next</button>

<style lang="postcss">
	button:disabled {
		@apply bg-black;
	}
</style>
