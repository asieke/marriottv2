// import { getAlbums } from '$lib/clients/google';

export async function POST({ locals }) {
	console.log('[API - getCalendars]');
	// console.log(request);

	const { user, googleClient } = locals;

	if (!user) {
		return new Response(JSON.stringify({ error: 'No user found' }), { status: 500 });
	}

	const albums = await googleClient.getAlbums();
	return new Response(JSON.stringify(albums));
}
