<script>
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let firstName = '';
	let lastName = '';
	let dni = '';
	let phone = '';
	let birthDate = '';
	let isLoading = false;
	let error = '';
	let success = '';

	async function handleSubmit() {
		if (isLoading) return;
		
		isLoading = true;
		error = '';
		success = '';

		try {
			const formData = new FormData();
			formData.append('email', email);
			formData.append('password', password);
			formData.append('firstName', firstName);
			formData.append('lastName', lastName);
			formData.append('dni', dni);
			formData.append('phone', phone);
			formData.append('birthDate', birthDate);

			const response = await fetch('/api/auth/register', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok) {
				success = '¡Usuario creado exitosamente! Redirigiendo al login...';
				console.log('✅ Registro exitoso:', data);
				
				// Redirigir al login después de 2 segundos
				setTimeout(() => {
					goto('/login');
				}, 2000);
			} else {
				error = data.error || 'Error al registrar usuario';
			}
		} catch (err) {
			error = 'Error de conexión. Por favor, inténtalo de nuevo.';
			console.error('❌ Error en registro:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Crear Cuenta
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Instituto Paulo Freire
			</p>
		</div>
		
		<form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			{/if}
			
			{#if success}
				<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
					{success}
				</div>
			{/if}
			
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="firstName" class="block text-sm font-medium text-gray-700">Nombre</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							required
							class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="Juan"
							bind:value={firstName}
						/>
					</div>
					<div>
						<label for="lastName" class="block text-sm font-medium text-gray-700">Apellido</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							required
							class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="Pérez"
							bind:value={lastName}
						/>
					</div>
				</div>
				
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						placeholder="tu@email.com"
						bind:value={email}
					/>
				</div>
				
				<div>
					<label for="dni" class="block text-sm font-medium text-gray-700">DNI *</label>
					<input
						id="dni"
						name="dni"
						type="text"
						required
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						placeholder="12345678"
						bind:value={dni}
					/>
				</div>
				
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						placeholder="Mínimo 8 caracteres"
						bind:value={password}
					/>
				</div>
				
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						placeholder="+54 11 1234-5678"
						bind:value={phone}
					/>
				</div>
				
				<div>
					<label for="birthDate" class="block text-sm font-medium text-gray-700">Fecha de Nacimiento (opcional)</label>
					<input
						id="birthDate"
						name="birthDate"
						type="date"
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						bind:value={birthDate}
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Creando cuenta...
					{:else}
						Crear Cuenta
					{/if}
				</button>
			</div>

			<div class="text-center">
				<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
					¿Ya tienes cuenta? Inicia sesión
				</a>
			</div>
		</form>
	</div>
</div>
