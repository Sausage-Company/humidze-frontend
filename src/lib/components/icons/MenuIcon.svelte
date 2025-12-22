<script lang="ts">
	interface Props {
		class?: string;
		size?: number;
		isOpen?: boolean;
	}

	let { class: className = 'stroke-white', size = 24, isOpen = false }: Props = $props();
</script>

<svg
	class={className}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g class="transition-all duration-300 origin-center" style="transform: rotate({isOpen ? '45deg' : '0deg'})">
		<line
			x1="4"
			y1="12"
			x2="20"
			y2="12"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			class="transition-all duration-300"
			style="transform: translateY({isOpen ? '0' : '-6px'})"
		/>
	</g>
	<line
		x1="4"
		y1="12"
		x2="20"
		y2="12"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="transition-all duration-300"
		style="opacity: {isOpen ? '0' : '1'}"
	/>
	<g class="transition-all duration-300 origin-center" style="transform: rotate({isOpen ? '-45deg' : '0deg'})">
		<line
			x1="4"
			y1="12"
			x2="20"
			y2="12"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			class="transition-all duration-300"
			style="transform: translateY({isOpen ? '0' : '6px'})"
		/>
	</g>
</svg>
