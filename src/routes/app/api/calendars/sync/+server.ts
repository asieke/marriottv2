export async function POST({ request, locals: { supabase } }) {
	const data = await request.json();

	const calendars = await supabase.syncCalendars(data);

	return new Response(JSON.stringify(calendars));
}
