// import { getAlbums } from '$lib/clients/google';

export async function GET({ request, locals: { googleClient, user } }) {
	// get the album id from the get request url param
	const url = new URL(request.url);
	const albumId = url.searchParams.get('albumId') || user?.user_metadata.album.id;

	if (!albumId) throw new Error('No albumId provided');

	const photos = await googleClient.getPhotos(albumId);
	console.log(request);

	return new Response(JSON.stringify(photos));
}
