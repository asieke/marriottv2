import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user, supabase } }) => {
	const { data, error } = await supabase.from('albums').select('*').eq('user_id', user?.id);

	if (error) console.error(error);

	return { album: data ? data[0] : null };
};
