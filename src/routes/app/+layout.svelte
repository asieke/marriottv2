<script>
	import { goto } from '$app/navigation';

	export let data;
	$: ({ supabase } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
		} else {
			goto('/');
		}
	};
</script>

<header>
	<nav class="w-full p-4 bg-black text-white">
		<div class="flex justify-between">
			<div class="flex space-x-6">
				<a href="/">Home</a>
				<a href="/app/dash/calendar">Calendar</a>
				<a href="/app/dash/photos">Photos</a>
			</div>
			<button on:click={logout}>Logout</button>
		</div>
	</nav>
</header>
<main class="p-8">
	<slot />
</main>
