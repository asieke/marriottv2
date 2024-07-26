import axios from 'axios';

export const urlToBase64 = async (url: string) => {
	try {
		const response = await axios.get(url, {
			responseType: 'arraybuffer'
		});
		const buffer = Buffer.from(response.data, 'binary');
		return buffer.toString('base64');
	} catch (error) {
		console.error('Error fetching the URL:', error);
		throw error;
	}
};
