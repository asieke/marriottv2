<script lang="ts">
	import { onMount } from 'svelte';

	import {
		Calendar,
		Sentence,
		Weather,
		Photo,
		Art,
		DateTime,
		Math,
		History,
		Modal
	} from './components';

	export let data;
	$: ({ supabase } = data);

	let modalShowing = false;

	onMount(async () => {
		// refresh the page every 45 minutes
		setInterval(
			() => {
				location.reload();
			},
			1000 * 60 * 55
		);

		// add an event listener that listens for the '0' key to be pressed
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '0') {
				// if the '0' key is pressed, reload the page
				modalShowing = !modalShowing;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
	});

	let random = 1;
</script>

{#if modalShowing}
	<Modal />
{/if}
<div
	class="grid grid-cols-4 gap-[1vw] px-[1vw] py-[2vh] h-[100vh] w-[100vw]"
	style="background: url('/backgrounds/{random}.jpg') no-repeat center center fixed; background-size: cover;"
>
	<div class="column">
		<div class="component h-[25%]">
			<DateTime />
		</div>
		<div class="component h-[25%]">
			<Weather />
		</div>
		<div class="component h-[50%]">
			<Photo />
		</div>
	</div>
	<div class="column">
		<div class="component h-[100%]">
			<History />
		</div>
	</div>
	<div class="column">
		<div class="component h-[75%]">
			<Art />
		</div>
		<div class="component h-[25%]">
			<Math />
		</div>
	</div>
	<div class="column">
		<div class="component h-[75%]">
			<Calendar />
		</div>
		<div class="component h-[25%]">
			<Sentence />
		</div>
	</div>
</div>

<style lang="postcss">
	.component {
		@apply p-[20px] overflow-hidden bg-black/80 rounded-lg shadow-lg;
	}
	.column {
		@apply h-[96vh] flex flex-col space-y-[1vh];
	}
</style>
