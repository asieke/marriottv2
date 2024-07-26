export async function GET({ locals: { supabase } }) {
	//get all the sentences with urls

	const { data, error } = await supabase.from('sentences').select('id, text, url').neq('url', null);

	if (error) {
		return new Response(JSON.stringify({ error }), { status: 500 });
	}

	return new Response(JSON.stringify(data));
}
