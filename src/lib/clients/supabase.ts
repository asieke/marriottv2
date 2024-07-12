import type { SupabaseClient } from '@supabase/supabase-js';
import type { GooglePhotoAlbum } from './google';
import type { Tables } from '$lib/types/database.types';

import { saveImage, saveAlbum } from '$lib/models/photos';

export interface ExtendedSupabaseClient extends SupabaseClient {
	saveImage: (user_id: string, sourceUrl: string, filename: string) => Promise<void>;
	saveAlbum: (user_id: string, album: GooglePhotoAlbum) => Promise<Tables<'albums'> | null>;
}

export const getExtendedClient = (supabase: SupabaseClient) => {
	const superClient = supabase as ExtendedSupabaseClient;

	/********************************
	 * Save an image to the user's bucket
	 ********************************/
	superClient.saveImage = async function (user_id: string, sourceUrl: string, filename: string) {
		return await saveImage(this, user_id, sourceUrl, filename);
	};

	/********************************
	 * Save an Album
	 ********************************/
	superClient.saveAlbum = async function (user_id: string, album: GooglePhotoAlbum) {
		return await saveAlbum(this, user_id, album);
	};

	return superClient;
};
