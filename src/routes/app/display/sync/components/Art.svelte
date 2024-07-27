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
	let totalArt = 0;
	let synced = 0;
	let pct = 0;

	onMount(async () => {
		const { data: rowCount } = await supabase.rpc('get_count_arts_with_image');
		totalArt = rowCount;
	});

	const syncArtists = async () => {
		console.log('syncing artists');

		await db.artists.clear();

		const { data } = (await supabase
			.from('artists')
			.select('id, name, region, start_year, end_year, short_description')) as {
			data: Tables<'artists'>[];
			error: any;
		};

		await db.artists.bulkAdd(
			data.map((d) => ({
				id: d.id,
				name: d.name || '',
				description: d.description || '',
				short_description: d.short_description || '',
				category: d.category || '',
				region: d.region || '',
				start_year: d.start_year || '',
				end_year: d.end_year || ''
			}))
		);
	};

	const syncArt = async () => {
		await syncArtists();
		console.log('Fetching Art Info');
		button.disabled = true;
		await db.arts.clear();
		console.log('Local Art Cleared');

		let slice = 1000;

		for (let i = 0; i < totalArt; i += slice) {
			pct = Math.round((100 * synced) / totalArt) || 0;
			synced = i;
			console.log('Fetching Art Info', i);
			const { data, error } = (await supabase
				.from('arts')
				.select('id, artist_id, title, category')
				.range(i, i + slice - 1)) as { data: Tables<'arts'>[]; error: any };

			if (!data) continue;

			const localData = data.map((d) => {
				return {
					id: d.id,
					artist_id: d.artist_id || -1,
					title: d.title || '',
					category: d.category || ''
				};
			});

			await db.arts.bulkAdd(localData);
		}

		pct = 100;
		button.disabled = false;
	};
</script>

<h1>Time to Sync Some Artwork</h1>
<h3>We will keep your Marriot Board looking fresh!</h3>

<h4>{synced} / {totalArt}</h4>

<div class="col-span-3 bg-slate-300 w-full h-12">
	<div class="h-full bg-blue-500" style="width: {pct}%"></div>
</div>

<button bind:this={button} on:click={syncArt}> Sync Art</button>
<button on:click={onNext}>Next</button>

<style lang="postcss">
	button:disabled {
		@apply bg-black;
	}
</style>
