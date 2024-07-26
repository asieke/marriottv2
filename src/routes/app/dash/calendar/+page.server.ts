import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const myCalendars = await supabase.getCalendars();

	return { calendars: myCalendars };
};
