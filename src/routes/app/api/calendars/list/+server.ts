// import { getCalendars } from '$lib/clients/google';

export async function POST({ locals: { googleClient, supabase } }) {
	const [googleCalendars, myCalendars] = await Promise.all([
		googleClient.getCalendars(),
		supabase.getCalendars()
	]);

	const calendars = googleCalendars?.map((calendar) => ({
		...calendar,
		// if there is a record in myCalendars with calendar.google_id, then use that value of is_selected
		is_selected:
			myCalendars?.find((myCalendar) => myCalendar.google_id === calendar.google_id)?.is_selected ||
			false
	}));

	return new Response(JSON.stringify(calendars));
}
