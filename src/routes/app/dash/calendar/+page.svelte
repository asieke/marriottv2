<script lang="ts">
	import type { PageData } from './$types';
	import axios from 'axios';

	export let data: PageData;
	$: ({ user, calendars, supabase } = data);

	const handleForm = async () => {
		await axios.post('/app/api/calendars/sync', calendars);
	};
</script>

<h1 class="text-xl pb-8">Manage Calendars</h1>

{#if calendars}
	{#each calendars as calendar}
		<div>
			<label>
				<input type="checkbox" name="isSelected" bind:checked={calendar.is_selected} />
				{calendar.summary}, {calendar.google_id}
			</label>
		</div>
	{/each}
	<button class="bg-blue-500 p-2 mt-4 text-white rounded" on:click={handleForm}>Save</button>
{/if}
