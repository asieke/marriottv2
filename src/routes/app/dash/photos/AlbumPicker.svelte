<script lang="ts">
	import type { GooglePhotoAlbum } from '$lib/clients/google';

	export let onAlbumClick: (album: GooglePhotoAlbum) => void;
	export let googleAlbums: GooglePhotoAlbum[] = [];
</script>

{#if googleAlbums.length > 0}
	<div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-4">
		{#each googleAlbums as album}
			<button
				on:click={() => onAlbumClick(album)}
				class="border rounded-lg overflow-hidden shadow-lg"
			>
				<img src={album.coverPhotoBaseUrl} alt={album.title} class="w-full h-48 object-cover" />
				<div class="p-4">
					<h2 class="text-xl font-semibold">{album.title}</h2>
					<p class="text-gray-600">{album.mediaItemsCount} photos</p>
				</div>
			</button>
		{/each}
	</div>
{/if}
