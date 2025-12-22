import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

interface LocationName {
	city: string;
	country: string;
}

export const GET: RequestHandler = async ({ url }) => {
	const latitude = url.searchParams.get('latitude');
	const longitude = url.searchParams.get('longitude');

	if (!latitude || !longitude) {
		return json(
			{ error: 'Missing latitude or longitude parameters' },
			{ status: 400 }
		);
	}

	try {
		const lat = parseFloat(latitude);
		const lon = parseFloat(longitude);

		if (isNaN(lat) || isNaN(lon)) {
			return json(
				{ error: 'Invalid latitude or longitude values' },
				{ status: 400 }
			);
		}

		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch location data from Nominatim');
		}

		const data = await response.json();

		const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
		const country = data.address?.country || 'Unknown';

		const result: LocationName = {
			city,
			country
		};

		return json(result);
	} catch (error) {
		console.error('Reverse geocoding error:', error);
		return json(
			{ error: 'Unable to determine your location name' },
			{ status: 500 }
		);
	}
};
