<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { PUBLIC_CALLBACK_URL } from '$env/static/public';

	export let data;

	$: ({ supabase } = data);

	const signIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				scopes:
					'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly',
				redirectTo: PUBLIC_CALLBACK_URL,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
	};

	$: signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<h1 class="text-3xl font-bold underline">Welcome to Marriott</h1>

<div>
	{#if $page.data.session}
		<button class="bg-red-400 p-5" on:click={() => signOut()}>Sign Out</button>
	{:else}
		<button class="bg-yellow-400 p-5" on:click={() => signIn()}>Sign in With Google</button>
	{/if}
</div>
