<script lang="ts">
	import { lf } from '$lib/clients/localfiles';
	import { set } from 'idb-keyval';
	export let onNext: () => void;

	let handle: FileSystemDirectoryHandle | null = null;

	const selectLocalFolder = async () => {
		handle = await lf.init(true);
	};
</script>

<h1>Hello, lets set up your Marriott Board!</h1>
<h3>
	To help your Marriot Board work offline - we need to set up a place to store assets offline.
	Please select a folder!
</h3>

{#if !handle}
	<button on:click={selectLocalFolder}> Pick a Local Folder</button>
{:else}
	<h4>Great! You selected <b>{handle?.name}</b> - lets keep going!</h4>

	<button on:click={onNext}> Next</button>
{/if}
