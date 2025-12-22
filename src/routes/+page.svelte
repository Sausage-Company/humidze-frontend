<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocation } from '$lib/browser/geolocation';
	import { getLocationName } from '$lib/api/location';
	import LocationIcon from '$lib/components/icons/LocationIcon.svelte';

	let latitude: number | null = null;
	let longitude: number | null = null;
	let locationName: string = '';
	let loading = true;
	let error: string | null = null;
	let currentDateTime: string = '';

	function updateDateTime() {
		const now = new Date();
		const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
		const month = now.toLocaleDateString('en-US', { month: 'long' });
		const day = now.getDate();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');

		currentDateTime = `${dayOfWeek}, ${month} ${day} • ${hours}:${minutes}`;
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

					const geocoded = await getLocationName(latitude, longitude);
					locationName = `${geocoded.city}, ${geocoded.country}`;
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

<main class="flex flex-col min-h-screen gap-8">
  <h1 class="sr-only">Humidze - Humidity Tracking Application</h1>
  <header class="flex items-center justify-between w-full h-20 px-4">
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
          <h2 class="text-3xl font-bold text-white">{locationName}</h2>
        {/if}

        <span class="uppercase">{currentDateTime}</span>
      </section>
    </section>
  </header>
</main>