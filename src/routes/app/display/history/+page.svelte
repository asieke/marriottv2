<script lang="ts">
	import { allEvents } from './events';
	import OpenAI from 'openai';
	import axios from 'axios';
	import { lf } from '$lib/clients/localfiles';
	import type { Tables } from '$lib/types/database.types';
	import { onMount, tick } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	type Event = {
		id: number;
		title: string;
		summary: string;
		image_query: string;
	};

	type Image = {
		url: string;
		width: number;
		height: number;
		thumbnail: string;
	};

	let query = '';
	let current = 0;
	let events: Event[] = [];
	let images: Image[] = [];

	onMount(async () => {
		//get the max id from events

		const max = await lf.getMaxFileName('events');

		console.log(max);

		const { data } = (await supabase
			.from('events')
			.select('id, image_query, title, summary')
			.gte('id', max)
			.order('id', { ascending: true })) as { data: Event[] };

		events = data;

		await getImage();
	});

	const getImage = async (query = '') => {
		const url =
			'/app/api/googleImages?query=' + (query === '' ? events[current].image_query : query);
		console.log(url);
		const { data } = await axios.get(url);
		images = data;
	};

	const saveImage = async (url: string) => {
		images = [];
		const { data: imageData } = await axios.post('/app/api/images/convert', {
			url: url
		});
		await lf.saveBase64File('events', `${events[current].id}`, imageData.base64);
		console.log('image saved locally - ', events[current].id, events[current].title);

		current = current + 1;
		await getImage();
	};

	const override = async () => {
		images = [];
		await getImage(query);
	};
</script>

<div class="p-16 space-y-8 text-2xl flex flex-col">
	<h1 class="text-4xl mb-8">
		[{events?.[current]?.id}] {events?.[current]?.title || 'Just History?'}
	</h1>
	<p class="text-xl">{events?.[current]?.summary}</p>

	<div class="flex flex-row">
		<input type="text" bind:value={query} class="p-4 text-2xl border-2 border-black w-1/2" />
		<button on:click={override} class="bg-blue-500 p-3">Submit</button>
	</div>

	<div class="grid grid-cols-3 gap-3">
		{#each images as img}
			<button on:click={() => saveImage(img.url)}>
				{img.width} x {img.height}
				<img src={img.thumbnail} alt="" class="w-full" />
			</button>
		{/each}
	</div>
</div>
