import { OPENAI_KEY } from '$env/static/private';
import { urlToBase64 } from '$lib/utils/image';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: OPENAI_KEY });

export async function POST({ request }) {
	const { sentence } = await request.json();

	console.log(sentence);
	console.log(OPENAI_KEY);

	const response = await openai.images.generate({
		model: 'dall-e-3',
		prompt: 'An image like you would see in a childrens book about this sentence: ' + sentence,
		n: 1,
		size: '1024x1024'
	});

	const image_url = response.data[0].url;

	const base64 = await urlToBase64(image_url || '');

	return new Response(JSON.stringify({ url: image_url, base64: base64 }));
}
