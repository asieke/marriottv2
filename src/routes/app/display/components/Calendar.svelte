<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { calendarColors, fdate } from '$lib/utils/calendar';
	import type { GoogleCalendarEvent } from '$types/google.types';
	import axios from 'axios';

	let events: { [date: string]: GoogleCalendarEvent[] } = {};
	let interval: NodeJS.Timeout;

	async function fetchEvents() {
		const { data } = await axios.get('/app/api/calendars/getEvents');

		const newEvents: { [date: string]: GoogleCalendarEvent[] } = {};

		for (const event of data) {
			const date = event.start.dateTime.split('T')[0];
			newEvents[date] = newEvents[date] ? [...newEvents[date], event] : [event];
		}

		events = newEvents;
	}

	onMount(() => {
		fetchEvents();
		interval = setInterval(
			() => {
				fetchEvents();
			},
			30 * 60 * 1000
		);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="h-full overflow-hidden text-white">
	{#each Object.entries(events) as [date, dailyevents]}
		<div>
			<div class="font-bold text-xl mb-2">{fdate(date).getLongDate()}</div>
			{#each dailyevents as { title, start, end, location, description, color }}
				<div class="grid grid-cols-[15px_1fr] pb-2 mb-2 rounded">
					<div class="w-full py-2" style="background-color: {calendarColors[color || 0]}" />
					<div class="bg-slate-700/80 w-full p-2">
						<div class="font-bold">{title}</div>
						{#if description}<div>{description}</div>{/if}
						<div>
							{fdate(start.dateTime).getTime()} - {fdate(end.dateTime).getTime()}
						</div>
						{#if location}<div class="text-sm">{location}</div>{/if}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
