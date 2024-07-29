<script lang="ts">
	import { db } from '$lib/clients/dexie';
	import { page } from '$app/stores';
	import { lf } from '$lib/clients/localfiles';

	export let onNext: () => void;

	const {
		data: { supabase }
	} = $page;

	let button: HTMLButtonElement;
	let synced = 0;
	let total = 0;
	let pct = 0;

	const syncSentences = async () => {
		// Delete everything from the photos table
		await db.sentences.clear();

		const { data: sentences } = await supabase.from('sentences').select('*').neq('base64', null);

		total = sentences.length;

		for (let i = 0; i < sentences.length; i++) {
			const sentence = sentences[i];
			await lf.saveBase64File('sentences', `${sentence.id}`, sentence.base64);
			await db.sentences.add({
				id: sentence.id,
				text: sentence.text
			});
			synced = i;
			pct = Math.round((synced / sentences.length) * 100);
		}

		pct = 100;
		button.disabled = false;
	};
</script>

<h1>Time to Sync Your Reading Modules</h1>
<h3>We will keep your Marriot Board looking fresh!</h3>

<div class="col-span-3 bg-slate-300 w-full h-12 relative">
	<div class="absolute left-2 top-2 text-lg">
		{#if total > 0}
			{synced} / {total}
		{/if}
	</div>
	<div class="h-full bg-blue-500" style="width: {pct}%"></div>
</div>
<button bind:this={button} on:click={syncSentences}> Sync Sentences</button>
<button on:click={onNext}>Next</button>

<style lang="postcss">
	button:disabled {
		@apply bg-black;
	}
</style>
