import { getLocation } from '$lib/browser/geolocation';
import { getLocationName } from '$lib/api/location';
import { getWeatherData } from '$lib/api/weather';

export type ErrorType = 'location' | 'weather' | 'permission' | null;

export interface WeatherDataState {
	latitude: number | null;
	longitude: number | null;
	locationName: string;
	temperature: number | null;
	humidity: number | null;
	loading: boolean;
	error: string | null;
	errorType: ErrorType;
}

export function useWeatherData() {
	let latitude = $state<number | null>(null);
	let longitude = $state<number | null>(null);
	let locationName = $state('');
	let temperature = $state<number | null>(null);
	let humidity = $state<number | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let errorType = $state<ErrorType>(null);

	async function fetchData() {
		loading = true;
		error = null;
		errorType = null;

		try {
			const location = await getLocation();
			if (!location) {
				error = 'Unable to access your location. Please enable location permissions in your browser settings.';
				errorType = 'permission';
				return;
			}

			latitude = location.latitude;
			longitude = location.longitude;

			try {
				const geocoded = await getLocationName(latitude, longitude);
				locationName = `${geocoded.city}, ${geocoded.country}`;
			} catch (err) {
				console.error('Location name error:', err);
				error = 'Unable to determine your location name. Continuing with coordinates...';
				errorType = 'location';
				locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
			}

			try {
				const weather = await getWeatherData(latitude, longitude);
				temperature = weather.temperature;
				humidity = weather.humidity;
			} catch (err) {
				console.error('Weather data error:', err);
				error = 'Unable to fetch weather data. Please check your internet connection and try again.';
				errorType = 'weather';
			}
		} catch (err) {
			console.error('Geolocation error:', err);
			const geolocationError = err as { code?: number; message: string };

			if (geolocationError.code === 1) {
				error = 'Location access denied. Please enable location permissions to use this app.';
				errorType = 'permission';
			} else if (geolocationError.code === 2) {
				error = 'Unable to determine your location. Please check your device settings.';
				errorType = 'location';
			} else if (geolocationError.code === 3) {
				error = 'Location request timed out. Please try again.';
				errorType = 'location';
			} else {
				error = geolocationError.message || 'Unable to access your location. Please enable location services and try again.';
				errorType = 'location';
			}
		} finally {
			loading = false;
		}
	}

	async function fetch() {
		await fetchData();
	}

	async function refetch() {
		latitude = null;
		longitude = null;
		locationName = '';
		temperature = null;
		humidity = null;
		await fetchData();
	}

	return {
		get latitude() { return latitude; },
		get longitude() { return longitude; },
		get locationName() { return locationName; },
		get temperature() { return temperature; },
		get humidity() { return humidity; },
		get loading() { return loading; },
		get error() { return error; },
		get errorType() { return errorType; },
		fetch,
		refetch
	};
}
