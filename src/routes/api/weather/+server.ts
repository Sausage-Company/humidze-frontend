import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { WEATHER_API_AUTH, WEATHER_API_URL } from '$env/static/private';

export interface WeatherData {
	temperature: number;
	humidity: number;
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
			`${WEATHER_API_URL}/current/${lat}/${lon}?code=${WEATHER_API_AUTH}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch weather data from API');
		}

		const data = await response.json();

		const result: WeatherData = {
			temperature: data.temperature,
			humidity: data.humidity
		};

		return json(result);
	} catch (error) {
		console.error('Weather API error:', error);
		return json(
			{ error: 'Unable to fetch weather data' },
			{ status: 500 }
		);
	}
};
