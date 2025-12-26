<script lang="ts">
	import { onMount } from 'svelte';
	import { useWeatherData } from '$lib/composables/useWeatherData.svelte';
	import LocationIcon from '$lib/components/icons/LocationIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import Card from '$lib/components/Card.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import WarningIcon from '$lib/components/icons/WarningIcon.svelte';

	const weatherData = useWeatherData();
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
		weatherData.fetch();
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
        {#if weatherData.loading}
          <div class="text-white text-lg">Getting your location...</div>
        {:else if weatherData.locationName}
          <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">{weatherData.locationName}</h2>
        {:else if weatherData.error && weatherData.errorType === 'permission'}
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
      {#if weatherData.loading}
        <Card variant="glass" size="lg" class="w-[280px] h-[240px] md:w-[320px] md:h-[240px]">
          <Skeleton width="w-48 md:w-56" height="h-20 md:h-24" rounded="lg" />
          <Skeleton width="w-32 md:w-40" height="h-6 md:h-7" rounded="md" />
        </Card>
        <Card variant="glass" size="lg" class="w-[280px] h-[240px] md:w-[320px] md:h-[240px]">
          <Skeleton width="w-48 md:w-56" height="h-20 md:h-24" rounded="lg" />
          <Skeleton width="w-32 md:w-40" height="h-6 md:h-7" rounded="md" />
        </Card>
      {:else if weatherData.errorType === 'weather' || weatherData.errorType === 'permission' || (weatherData.error && !weatherData.temperature && !weatherData.humidity)}
        <Card variant="glass" size="lg" class="w-[280px] h-[240px] md:w-[320px] md:h-[240px]">
          <div class="flex flex-col items-center justify-center gap-4 text-center px-4">
            <WarningIcon size={48} />
            <div class="flex flex-col gap-2">
              <h3 class="text-base md:text-lg font-bold text-red-400">
                {weatherData.errorType === 'permission' ? 'Permission Denied' : weatherData.errorType === 'weather' ? 'Data Unavailable' : 'Error'}
              </h3>
              <p class="text-xs md:text-sm text-weather-text-muted">{weatherData.error}</p>
            </div>
            <Button variant="primary" size="sm" onclick={weatherData.refetch}>
              Try Again
            </Button>
          </div>
        </Card>
      {:else if weatherData.temperature !== null && weatherData.humidity !== null}
        <Card variant="glass" size="lg" class="w-[280px] h-[240px] md:w-[320px] md:h-[240px]">
          <span class="text-6xl md:text-8xl font-bold text-white transition-all duration-300 {getTemperatureShadow(weatherData.temperature)}">{weatherData.temperature.toFixed(1)}°</span>
          <span class="text-xl md:text-2xl text-weather-text-muted">Temperature</span>
        </Card>
        <Card variant="glass" size="lg" class="w-[280px] h-[240px] md:w-[320px] md:h-[240px]">
          <span class="text-6xl md:text-8xl font-bold text-blue-400">{weatherData.humidity.toFixed(0)}%</span>
          <span class="text-xl md:text-2xl text-weather-text-muted">Humidity</span>
        </Card>
      {/if}
    </div>
  </section>
</main>