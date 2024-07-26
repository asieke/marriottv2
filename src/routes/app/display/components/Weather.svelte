<script lang="ts">
	import { Umbrella, ArrowUp, ArrowDown, Moon, Sun } from 'lucide-svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import type { DailyWeather } from '$lib/types/components.types';

	let dailyWeather: DailyWeather[];

	const updateWeather = async () => {
		const { data } = await axios.get<DailyWeather[]>('/app/api/weather');
		dailyWeather = data;
	};

	onMount(async () => {
		await updateWeather();
		setInterval(
			async () => {
				await updateWeather();
				console.log('updated weather', new Date());
			},
			60 * 60 * 1000
		); //update weather every hour
	});
</script>

<div class="flex align-middle items-center w-full text-white">
	<div class="grid grid-cols-4 gap-1 text-center w-full">
		{#if dailyWeather}
			{#each dailyWeather as item}
				<div class="flex flex-col justify-center align-middle items-center space-y-1">
					<div class="font-bold">{item.day}</div>
					<div>
						<img
							class="h-18 w-18"
							src="https://openweathermap.org/img/wn/{item.icon}@2x.png"
							alt={item.description}
						/>
					</div>
					<div class="flex flex-row">
						<ArrowDown class="h-5 w-5 pt-1" />{item.low}
						<ArrowUp class="h-5 w-5 pt-1" />{item.high}
					</div>
					<div class="flex flex-row pt-1">
						<Umbrella class="h-5 w-5 pt-[4px] pr-1" />{item.pop}%
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
