// import { getCalendars } from '$lib/clients/google';

export async function POST({ locals }) {
	console.log('[API - getCalendars]');
	// console.log(request);

	const { user, googleClient } = locals;

	if (!user) {
		return new Response(JSON.stringify({ hello: 'world' }));
	}

	await googleClient.getCalendars();

	return new Response(JSON.stringify({ hello: 'world' }));
}
