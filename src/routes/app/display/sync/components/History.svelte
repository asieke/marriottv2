<script lang="ts">
	import { db } from '$lib/clients/dexie';
	import { page } from '$app/stores';
	import { lf } from '$lib/clients/localfiles';
	import type { Tables } from '$lib/types/database.types';

	const {
		data: { supabase }
	} = $page;

	let button: HTMLButtonElement;
	let synced = 0;
	let total = 0;
	let pct = 0;

	const syncEvents = async () => {
		// Delete everything from the photos table
		await db.events.clear();

		const { data: events } = (await supabase
			.from('events')
			.select('id, title, summary, date, facts, questions')) as {
			data: Tables<'events'>[];
		};

		total = events.length;

		for (let i = 0; i < events.length; i++) {
			const event = events[i];
			await db.events.add(event);
			synced = i;
			pct = Math.round((synced / events.length) * 100);
		}

		pct = 100;
		button.disabled = false;
	};
</script>

<h1>Time to Sync Your Events</h1>
<h3>We will keep your Marriot Board looking fresh!</h3>

<div class="col-span-3 bg-slate-300 w-full h-12 relative">
	<div class="absolute left-2 top-2 text-lg">
		{#if total > 0}
			{synced} / {total}
		{/if}
	</div>
	<div class="h-full bg-blue-500" style="width: {pct}%"></div>
</div>
<button bind:this={button} on:click={syncEvents}> Sync Events</button>

<style lang="postcss">
	button:disabled {
		@apply bg-black;
	}
</style>
