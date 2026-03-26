<script lang="ts">
	export let type: 'text' | 'email' | 'password' | 'tel' | 'number' = 'text';
	export let placeholder = '';
	export let value = '';
	export let label = '';
	export let error = '';
	export let disabled = false;
	export let required = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';
	
	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg'
	};

	const inputClasses = `${baseClasses} ${sizeClasses[size]} ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''}`;
</script>

<div class="space-y-1">
	{#if label}
		<label for={label} class="block text-sm font-medium text-gray-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	
	<input
		id={label}
		{type}
		{placeholder}
		{value}
		{disabled}
		{required}
		class={inputClasses}
		on:input={(e) => value = e.target.value}
	/>
	
	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
