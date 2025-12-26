<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		class?: string;
	}

	let {
		width = 'w-full',
		height = 'h-4',
		rounded = 'md',
		class: className = ''
	}: Props = $props();

	const roundedClasses = {
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		full: 'rounded-full'
	};

	const classes = `${width} ${height} ${roundedClasses[rounded]} bg-glass-light animate-pulse ${className}`;
</script>

<div class={classes}></div>
