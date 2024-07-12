<script lang="ts">
	import type { PageData } from './$types';
	import axios from 'axios';

	export let data: PageData;

	$: ({ user } = data);
</script>

<h1>Private page for user: {user?.email}</h1>
