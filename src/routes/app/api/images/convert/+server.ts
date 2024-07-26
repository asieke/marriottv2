import { urlToBase64 } from '$lib/utils/image';

export async function POST({ request }) {
	const { url } = await request.json();
	const base64 = await urlToBase64(url);

	return new Response(JSON.stringify({ url: url, base64: base64 }));
}
