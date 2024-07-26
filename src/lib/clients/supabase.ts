import type { SupabaseClient } from '@supabase/supabase-js';
import type { GooglePhotoAlbum } from './google';
import type { Tables } from '$lib/types/database.types';

import { saveImage, saveAlbum } from '$lib/models/photos';

export interface ExtendedSupabaseClient extends SupabaseClient {
	sayHello: () => string;
	saveImage: (sourceUrl: string, filename: string) => Promise<void>;
	saveAlbum: (album: GooglePhotoAlbum) => Promise<Tables<'albums'> | null>;
	getSelectedAlbum: () => Promise<Tables<'albums'> | null>;
	user_id: string;
	setUser: (user_id: string) => void;
	getCalendars: () => Promise<Tables<'calendars'>[] | null>;
	syncCalendars: (calendars: Tables<'calendars'>[]) => Promise<string[]>;
	getSentences: () => Promise<Tables<'sentences'>[]>;
}

export const getExtendedClient = (supabase: SupabaseClient) => {
	const superClient = supabase as ExtendedSupabaseClient;
	superClient.user_id = '';

	superClient.sayHello = function () {
		return 'Hello there';
	};

	superClient.setUser = function (user_id: string) {
		this.user_id = user_id;
	};

	superClient.saveImage = async function (sourceUrl: string, filename: string) {
		return await saveImage(this, this.user_id, sourceUrl, filename);
	};

	superClient.getSelectedAlbum = async function () {
		const { data } = await this.from('albums').select('*').eq('user_id', this.user_id);
		return data?.[0] as Tables<'albums'> | null;
	};

	superClient.saveAlbum = async function (album: GooglePhotoAlbum) {
		await this.auth.updateUser({
			data: { album }
		});

		return await saveAlbum(this, this.user_id, album);
	};

	superClient.getCalendars = async function () {
		const { data } = await this.from('calendars').select('*').eq('user_id', this.user_id);
		return data as Tables<'calendars'>[] | null;
	};

	superClient.getSentences = async function () {
		const { data } = await this.from('sentences').select('*').neq('url', null);
		return data as Tables<'sentences'>[] | [];
	};

	superClient.syncCalendars = async function (calendars: Tables<'calendars'>[]) {
		await this.from('calendars').upsert(calendars, { onConflict: 'google_id' });

		const selectedCalendars = calendars
			.filter((cal) => cal.is_selected)
			.map((cal) => cal.google_id);

		console.log('syncing calendars', calendars);

		await this.auth.updateUser({
			data: { selectedCalendars }
		});

		return selectedCalendars;

		// console.log('calendars synced');
	};
	return superClient;
};
