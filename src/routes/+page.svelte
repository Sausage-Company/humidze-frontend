<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocation } from '$lib/browser/geolocation';
	import { getLocationName } from '$lib/api/location';

	let latitude: number | null = null;
	let longitude: number | null = null;
	let locationName: string = '';
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
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
	});
</script>

<svelte:head>
	<title>Humidze - App</title>
</svelte:head>

<main class="flex flex-col min-h-screen gap-8">
  <h1 class="sr-only">Humidze - Humidity Tracking Application</h1>
  <header class="flex justify-between w-full h-16">
    <section class="flex-1">
      {#if loading}
        <div class="text-white text-lg">Getting your location...</div>
      {/if}
      <h2 class="text-3xl font-bold text-white">{locationName}</h2>
    </section>
   
    {#if error}
      <div class="text-red-500 text-center max-w-md">
        <p>{error}</p>
      </div>
    {/if}
  </header>
</main>