<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'glass' | 'gradient';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		class: className = '',
		children
	}: Props = $props();

	const baseClasses = 'rounded-xl transition-all duration-300 flex flex-col items-center justify-center';

	const variantClasses = {
		default: 'bg-glass backdrop-blur-glass border border-glass-border shadow-weather-card',
		glass: 'bg-glass-light backdrop-blur-glass border border-glass-border shadow-lg hover:shadow-xl',
		gradient: 'bg-gradient-to-br from-glass to-glass-light backdrop-blur-glass border border-glass-border shadow-weather-card'
	};

	const sizeClasses = {
		sm: 'p-4 gap-2',
		md: 'p-6 gap-4',
		lg: 'p-8 gap-6'
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

<div class={classes}>
	{@render children?.()}
</div>
