<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocation } from '$lib/browser/geolocation';
	import { getLocationName } from '$lib/api/location';
	import { getWeatherData } from '$lib/api/weather';
	import LocationIcon from '$lib/components/icons/LocationIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';

	let latitude = $state<number | null>(null);
	let longitude = $state<number | null>(null);
	let locationName = $state('');
	let temperature = $state<number | null>(null);
	let humidity = $state<number | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
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

	onMount(() => {
		updateDateTime();
		const interval = setInterval(updateDateTime, 60000);

		(async () => {
			try {
				const location = await getLocation();
				if (location) {
					latitude = location.latitude;
					longitude = location.longitude;

					const [geocoded, weather] = await Promise.all([
						getLocationName(latitude, longitude),
						getWeatherData(latitude, longitude)
					]);

					locationName = `${geocoded.city}, ${geocoded.country}`;
					temperature = weather.temperature;
					humidity = weather.humidity;
				}
			} catch (err) {
				error = (err as { message: string }).message || 'Failed to get location';
			} finally {
				loading = false;
			}
		})();

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
        {/if}

        {#if error}
          <div class="text-red-500 text-center max-w-md">
            <p>{error}</p>
          </div>
        {/if}

        {#if locationName}
          <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">{locationName}</h2>
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

  {#if temperature !== null && humidity !== null}
    <section class="flex flex-col items-center justify-center gap-8 px-4">
      <div class="flex flex-col md:flex-row gap-8 md:gap-16">
        <div class="flex flex-col items-center">
          <span class="text-6xl md:text-8xl font-bold text-white transition-all duration-300 {getTemperatureShadow(temperature)}">{temperature.toFixed(1)}°</span>
          <span class="text-xl md:text-2xl text-weather-text-muted">Temperature</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-6xl md:text-8xl font-bold text-blue-400">{humidity.toFixed(0)}%</span>
          <span class="text-xl md:text-2xl text-weather-text-muted">Humidity</span>
        </div>
      </div>
    </section>
  {/if}
</main>