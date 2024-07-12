// models/images.ts
import type { GooglePhotoAlbum } from '$lib/clients/google';
import type { Tables } from '$lib/types/database.types';
import type { ExtendedSupabaseClient } from '$lib/clients/supabase';

/**
 * Save an image to the user's bucket
 *
 * @param {SupabaseClient} supabase - The Supabase client.
 * @param {string} user_id - The user ID.
 * @param {string} sourceUrl - The URL of the image to save.
 * @param {string} filename - The desired filename.
 * @returns {Promise<void>} A promise that resolves when the image is saved.
 */
export const saveImage = async (
	supabase: ExtendedSupabaseClient,
	user_id: string,
	sourceUrl: string,
	filename: string
): Promise<void> => {
	try {
		const response = await fetch(sourceUrl, { mode: 'cors' });
		if (!response.ok) {
			throw new Error(`Failed to fetch image. Status: ${response.status}`);
		}
		const blob = await response.blob();
		const outUrl = `${user_id}/${filename}.jpg`;

		await supabase.storage
			.from('images') // Replace with your actual bucket name
			.upload(outUrl, blob, {
				upsert: true
			});
	} catch (error) {
		console.error('Error saving image:', error);
	}
};

/**
 * Save an album
 *
 * @param {SupabaseClient} supabase - The Supabase client.
 * @param {string} user_id - The user ID.
 * @param {GooglePhotoAlbum} album - The album to save.
 * @returns {Promise<Tables<'albums'> | null>} The saved album data or null.
 */
export const saveAlbum = async (
	supabase: ExtendedSupabaseClient,
	user_id: string,
	album: GooglePhotoAlbum
): Promise<Tables<'albums'> | null> => {
	await saveImage(supabase, user_id, album.coverPhotoBaseUrl, `album_${album.id}`);

	const fileName = `${user_id}/album_${album.id}.jpg`;

	const { data } = await supabase.storage
		.from('images')
		.createSignedUrl(fileName, 60 * 60 * 24 * 365);

	const albumData = {
		user_id,
		google_album_id: album.id,
		img_url: data?.signedUrl,
		title: album.title
	};

	const { data: rowData } = await supabase
		.from('albums')
		.upsert(albumData, { onConflict: 'user_id' })
		.select();

	return rowData?.[0] || null;
};
