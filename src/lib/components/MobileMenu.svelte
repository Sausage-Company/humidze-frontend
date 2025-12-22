<script lang="ts">
	import type { Snippet } from 'svelte';
	import MenuIcon from '$lib/components/icons/MenuIcon.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			closeMenu();
		}
	}
</script>

<button
	onclick={toggleMenu}
	class="md:hidden fixed top-4 right-4 z-50 p-2 bg-glass backdrop-blur-glass rounded-lg border border-glass-border hover:bg-glass-light transition-all"
	aria-label={isOpen ? 'Close menu' : 'Open menu'}
>
	<MenuIcon {isOpen} size={24} class="stroke-weather-text-primary" />
</button>

{#if isOpen}
	<div
		onclick={closeMenu}
		onkeydown={handleKeydown}
		class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
		role="button"
		tabindex="-1"
	></div>
{/if}

<div
	class="md:hidden fixed top-0 right-0 left-0 bg-weather-teal shadow-weather-card z-40 rounded-b-lg transform transition-all duration-500 ease-in-out origin-top {isOpen
		? 'scale-y-100 opacity-100'
		: 'scale-y-0 opacity-0 pointer-events-none'}"
>
	<nav class="flex flex-col gap-4 p-6 pt-20">
		{@render children?.()}
	</nav>
</div>
