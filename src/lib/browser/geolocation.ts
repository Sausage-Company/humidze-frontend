export interface Location {
	latitude: number;
	longitude: number;
}

export interface GeolocationError {
	code: number;
	message: string;
}

const MAXIMUM_AGE_IN_SECONDS = 30000;

/**
 * Requests user's geolocation using the browser Geolocation API
 * @returns Promise resolving to user's coordinates or null if permission denied
 */
export function getLocation(): Promise<Location | null> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject({
				code: 0,
				message: 'Geolocation is not supported by this browser'
			} as GeolocationError);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			(error) => {
				const errorData: GeolocationError = {
					code: error.code,
					message: getErrorMessage(error.code)
				};
				reject(errorData);
			},
			{
				enableHighAccuracy: false,
				timeout: 10000,
				maximumAge: MAXIMUM_AGE_IN_SECONDS
			}
		);
	});
}

function getErrorMessage(code: number): string {
	switch (code) {
		case 1:
			return 'Permission denied. Please enable location access in your browser settings.';
		case 2:
			return 'Position unavailable. Unable to retrieve your location.';
		case 3:
			return 'Request timeout. Please try again.';
		default:
			return 'An unknown error occurred while retrieving your location.';
	}
}
