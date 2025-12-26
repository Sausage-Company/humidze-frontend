export interface WeatherData {
	temperature: number;
	humidity: number;
}

/**
 * Fetches current weather data for given coordinates
 * @param latitude - User's latitude coordinate
 * @param longitude - User's longitude coordinate
 * @returns Promise resolving to temperature and humidity data
 */
export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
	try {
		const response = await fetch(
			`/api/weather?latitude=${latitude}&longitude=${longitude}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch weather data');
		}

		const data = await response.json();

		if (data.error) {
			throw new Error(data.error);
		}

		return {
			temperature: data.temperature,
			humidity: data.humidity
		};
	} catch (error) {
		console.error('Weather data fetch error:', error);
		throw new Error('Unable to fetch weather data');
	}
}
