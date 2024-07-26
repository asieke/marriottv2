export async function POST({ request, locals }) {
	const { album } = await request.json();

	const { user, supabase } = locals;

	if (!user) {
		return new Response(JSON.stringify({ error: 'No user found' }), { status: 500 });
	}

	const data = await supabase.saveAlbum(album);

	return new Response(JSON.stringify(data));
}
