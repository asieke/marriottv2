<script lang="ts">
	import { Art, Initiate, Slideshow, Sentences, History } from './components';

	let steps = [Initiate] as any;
	// let steps = [Initiate, Art, Slideshow, Sentences, History] as any;

	let currentStep = 0;

	const onNext = () => {
		currentStep = (currentStep + 1) % steps.length;
	};
</script>

<div class="w-[100vw] h-[100vh] bg-slate-200 py-[20vh]">
	<div
		class="w-[50vw] h-[50vh] mx-auto flex items-center justify-center bg-slate-50 rounded-xl shadow-lg p-16 text-center onboarding"
	>
		{#each steps as step, i}
			{#if i === currentStep}
				<svelte:component this={steps[i]} {onNext} />
			{/if}
		{/each}
	</div>
</div>
