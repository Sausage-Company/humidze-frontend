<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocation } from '$lib/browser/geolocation';
	import { getLocationName } from '$lib/api/location';
	import { getWeatherData } from '$lib/api/weather';
	import LocationIcon from '$lib/components/icons/LocationIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import Card from '$lib/components/Card.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';

	let latitude = $state<number | null>(null);
	let longitude = $state<number | null>(null);
	let locationName = $state('');
	let temperature = $state<number | null>(null);
	let humidity = $state<number | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let errorType = $state<'location' | 'weather' | 'permission' | null>(null);
	let currentDateTime = $state('');

	function updateDateTime() {
		const now = new Date();
		const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
		const month = now.toLocaleDateString('en-US', { month: 'long' });
		const day = now.getDate();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');

		currentDateTime = `${dayOfWeek}, ${month} ${day} • ${hours}:${minutes}`;
	}

	function getTemperatureShadow(temp: number | null): string {
		if (temp === null) return '';

		if (temp <= 0) {
			return 'drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]';
		} else if (temp <= 10) {
			return 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] drop-shadow-[0_0_40px_rgba(59,130,246,0.4)]';
		} else if (temp <= 25) {
			return '';
		} else if (temp <= 35) {
			return 'drop-shadow-[0_0_20px_rgba(234,179,8,0.8)] drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]';
		} else {
			return 'drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] drop-shadow-[0_0_40px_rgba(249,115,22,0.4)]';
		}
	}

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
			const message = (err as { message: string }).message || '';

			if (message.includes('User denied')) {
				error = 'Location access denied. Please enable location permissions to use this app.';
				errorType = 'permission';
			} else {
				error = 'Unable to access your location. Please enable location services and try again.';
				errorType = 'location';
			}
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		updateDateTime();
		const interval = setInterval(updateDateTime, 60000);
		fetchData();
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Humidze - App</title>
	<meta name="description" content="Get accurate humidity information for your location. Humidze automatically detects your location and provides real-time humidity updates." />
</svelte:head>

<main class="flex flex-col min-h-dvh gap-8">
  <h1 class="sr-only">Humidze - Humidity Tracking Application</h1>
  <header class="flex flex-col md:items-center justify-between w-full h-20 px-4 md:flex-row">
    <section class="flex-1 flex flex-row gap-4 items-center">
      <LocationIcon class="fill-red-400" size={24} />
      <section>
        {#if loading}
          <div class="text-white text-lg">Getting your location...</div>
        {:else if locationName}
          <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">{locationName}</h2>
        {:else if error && errorType === 'permission'}
          <div class="text-red-400 text-base md:text-lg">Location Required</div>
        {:else}
          <div class="text-weather-text-muted text-base md:text-lg">Location Unknown</div>
        {/if}

        <span class="text-sm sm:text-md md:text-base text-weather-text-muted uppercase">{currentDateTime}</span>
      </section>
      <MobileMenu>
        <section class="flex flex-col gap-4">
          <Button variant="ghost" disabled>Change Location</Button>
          <Button variant="ghost" disabled>Settings</Button>
        </section>
      </MobileMenu>
    </section>
    <section class="hidden md:flex flex-row gap-4">
      <Button variant="ghost" disabled>Change Location</Button>
      <Button variant="ghost" disabled>Settings</Button>
    </section>
  </header>

  <section class="flex flex-col items-center justify-center gap-8 px-4">
    <div class="flex flex-col md:flex-row gap-8 md:gap-16">
      {#if loading}
        <Card variant="glass" size="lg" class="w-[280px] h-[200px] md:w-[320px] md:h-[240px]">
          <Skeleton width="w-48 md:w-56" height="h-20 md:h-24" rounded="lg" />
          <Skeleton width="w-32 md:w-40" height="h-6 md:h-7" rounded="md" />
        </Card>
        <Card variant="glass" size="lg" class="w-[280px] h-[200px] md:w-[320px] md:h-[240px]">
          <Skeleton width="w-48 md:w-56" height="h-20 md:h-24" rounded="lg" />
          <Skeleton width="w-32 md:w-40" height="h-6 md:h-7" rounded="md" />
        </Card>
      {:else if errorType === 'weather' || errorType === 'permission' || (error && !temperature && !humidity)}
        <Card variant="glass" size="lg" class="w-[280px] h-[200px] md:w-[320px] md:h-[240px]">
          <div class="flex flex-col items-center justify-center gap-4 text-center px-4">
            <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="flex flex-col gap-2">
              <h3 class="text-base md:text-lg font-bold text-red-400">
                {errorType === 'permission' ? 'Permission Denied' : errorType === 'weather' ? 'Data Unavailable' : 'Error'}
              </h3>
              <p class="text-xs md:text-sm text-weather-text-muted">{error}</p>
            </div>
            <Button variant="primary" size="sm" onclick={fetchData}>
              Try Again
            </Button>
          </div>
        </Card>
      {:else if temperature !== null && humidity !== null}
        <Card variant="glass" size="lg" class="w-[280px] h-[200px] md:w-[320px] md:h-[240px]">
          <span class="text-6xl md:text-8xl font-bold text-white transition-all duration-300 {getTemperatureShadow(temperature)}">{temperature.toFixed(1)}°</span>
          <span class="text-xl md:text-2xl text-weather-text-muted">Temperature</span>
        </Card>
        <Card variant="glass" size="lg" class="w-[280px] h-[200px] md:w-[320px] md:h-[240px]">
          <span class="text-6xl md:text-8xl font-bold text-blue-400">{humidity.toFixed(0)}%</span>
          <span class="text-xl md:text-2xl text-weather-text-muted">Humidity</span>
        </Card>
      {/if}
    </div>
  </section>
</main>