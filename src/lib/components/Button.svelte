<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		class?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses = 'font-weather cursor-pointer font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = {
		primary: 'bg-weather-button text-weather-text-primary shadow-weather-btn hover:brightness-110',
		secondary: 'bg-weather-teal text-weather-text-primary shadow-weather-card hover:bg-weather-teal-dark',
		ghost: 'bg-transparent text-weather-text-secondary border border-glass-border hover:bg-glass-light',
		glass: 'bg-glass backdrop-blur-glass text-weather-text-primary border border-glass-border hover:bg-glass-light'
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`);
</script>

<button {disabled} {onclick} class={classes}>
	{@render children?.()}
</button>
