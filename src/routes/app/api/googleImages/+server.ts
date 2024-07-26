import axios from 'axios';

const queryGoogleImages = async (text: string) => {
	const search_engine_id = '46a07720761da4687';
	const api_key = 'AIzaSyCkeSdOTQLa5mz2H9EcIy2XAQuWFzV4e6Y';
	const num_results = 6;

	const queryUrl = `https://www.googleapis.com/customsearch/v1?q=${text}&cx=${search_engine_id}&key=${api_key}&searchType=image&num=${num_results}`;

	const { data } = await axios.get(queryUrl);

	const images = data.items
		.filter((item: { link: string }, index: number) => index < 6)
		.map(
			(item: {
				link: string;
				image: {
					width: number;
					height: number;
					thumbnailLink: string;
				};
			}) => ({
				url: item.link,
				width: item.image.width,
				height: item.image.height,
				thumbnail: item.image.thumbnailLink
			})
		);

	return images;
};

export async function GET({ request }) {
	const url = new URL(request.url);
	const text = url.searchParams.get('query') || 'dogs';

	const images = await queryGoogleImages(text);

	return new Response(JSON.stringify(images));
}
