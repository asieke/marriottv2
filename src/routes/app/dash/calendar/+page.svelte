<script lang="ts">
	import type { PageData } from './$types';
	import axios from 'axios';

	export let data: PageData;

	$: ({ user } = data);

	const onCalendarClick = async () => {
		if (!user) return;

		const { data } = await axios.post('/app/api/calendars/list', { user });

		console.log(data);
	};

	console.log(data.user);
</script>

<h1>Manage Calendars</h1>

<button class="p-4 bg-blue-500" on:click={onCalendarClick}>Get Calendars</button>
