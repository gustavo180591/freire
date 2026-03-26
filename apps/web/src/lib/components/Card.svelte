<script lang="ts">
	export let title = '';
	export let description = '';
	export let footer = '';
	export let variant: 'default' | 'bordered' | 'shadow' = 'default';

	const baseClasses = 'bg-white rounded-lg';
	
	const variantClasses = {
		default: '',
		bordered: 'border border-gray-200',
		shadow: 'shadow-lg'
	};
</script>

<div class={`${baseClasses} ${variantClasses[variant]}`}>
	{#if title || description}
		<div class="px-6 py-4 border-b border-gray-200">
			{#if title}
				<h3 class="text-lg font-medium text-gray-900">{title}</h3>
			{/if}
			{#if description}
				<p class="mt-1 text-sm text-gray-500">{description}</p>
			{/if}
		</div>
	{/if}
	
	<div class="px-6 py-4">
		<slot />
	</div>
	
	{#if footer}
		<div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
			{footer}
		</div>
	{/if}
</div>
