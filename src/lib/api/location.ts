export interface LocationName {
	city: string;
	country: string;
}

/**
 * Fetches the location name for given coordinates
 * @param latitude - User's latitude coordinate
 * @param longitude - User's longitude coordinate
 * @returns Promise resolving to city and country name
 */
export async function getLocationName(latitude: number, longitude: number): Promise<LocationName> {
	try {
		const response = await fetch(
			`/api/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch location data');
		}

		const data = await response.json();

		if (data.error) {
			throw new Error(data.error);
		}

		return {
			city: data.city,
			country: data.country
		};
	} catch (error) {
		console.error('Reverse geocoding error:', error);
		throw new Error('Unable to determine your location name');
	}
}
