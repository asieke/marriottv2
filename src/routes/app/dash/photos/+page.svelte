<script lang="ts">
	import type { GooglePhotoAlbum } from '$lib/clients/google';
	import type { PageData } from './$types';
	import axios from 'axios';
	import AlbumPicker from './AlbumPicker.svelte';

	export let data: PageData;

	let state = 'default';
	let googleAlbums: GooglePhotoAlbum[] = [];

	$: ({ supabase, user, album } = data);

	const onSelectAlbumClick = async () => {
		state = 'loading';
		const { data } = await axios.post('/app/api/photos/getAlbums');
		googleAlbums = data;
		state = 'selecting';
	};

	const onAlbumClick = async (clickedAlbum: GooglePhotoAlbum) => {
		//force the page the re-run +page.server.ts
		state = 'saving';

		const { data } = await axios.post('/app/api/photos/saveAlbum', { album: clickedAlbum });
		album = data;
		state = 'default';
	};
</script>

<div class="space-y-6">
	{#if state === 'default' && album}
		<h1>Your Google Album</h1>
		<div class="border rounded-lg overflow-hidden shadow-lg w-40 text-center">
			<img src={album.img_url} alt={album.title} class="w-full h-48 object-cover" />
			<div class="p-4">
				<h2 class="text-xl font-semibold">{album.title}</h2>
			</div>
		</div>
		<button class="p-4 bg-blue-500" on:click={onSelectAlbumClick}>Change you Album</button>
	{:else if state === 'default' && !album}
		<h1>Please Select a Google Album to Display</h1>
		<button class="p-4 bg-blue-500" on:click={onSelectAlbumClick}>Select your Album</button>
	{:else if state === 'loading'}
		<h1>Loading...</h1>
	{:else if state === 'saving'}
		<h1>Saving Album...</h1>
	{:else if state === 'selecting'}
		<AlbumPicker {onAlbumClick} {googleAlbums} />
	{/if}
</div>
