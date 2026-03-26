<script>
	import { page } from '$app/stores';
	
	// Obtener datos del usuario desde el middleware
	export let data;
	
	$: user = data.locals?.user;
	$: userRoles = user?.roles || [];
	$: isAdmin = userRoles.includes('admin');
	$: isDocente = userRoles.includes('docente');
	$: isAlumno = userRoles.includes('alumno');
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-gray-900">
						Instituto Paulo Freire
					</h1>
				</div>
				
				{#if user}
					<div class="flex items-center space-x-4">
						<span class="text-sm text-gray-700">
							Bienvenido, <strong class="font-medium">{user.firstName} {user.lastName}</strong>
						</span>
						
						<div class="flex space-x-2">
							{#each userRoles as role}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
									{role}
								</span>
							{/each}
						</div>
						
						<form action="/api/auth/logout" method="POST" class="inline">
							<button type="submit" class="text-sm text-gray-500 hover:text-gray-700">
								Cerrar Sesión
							</button>
						</form>
					</div>
				{:else}
					<a href="/login" class="text-sm text-gray-500 hover:text-gray-700">
						Iniciar Sesión
					</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		{#if user}
			<!-- User Info Card -->
			<div class="bg-white overflow-hidden shadow rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
								<span class="text-white font-medium text-lg">
									{user.firstName[0]}{user.lastName[0]}
								</span>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900">
								{user.firstName} {user.lastName}
							</h3>
							<p class="text-sm text-gray-500">
								{user.email}
							</p>
							<p class="text-sm text-gray-500">
								DNI: {user.dni}
							</p>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
									<span class="text-white text-sm font-medium">📚</span>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Carreras</dt>
									<dd class="text-lg font-medium text-gray-900">0</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
									<span class="text-white text-sm font-medium">💰</span>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Pagos</dt>
									<dd class="text-lg font-medium text-gray-900">0</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
									<span class="text-white text-sm font-medium">📊</span>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Reportes</dt>
									<dd class="text-lg font-medium text-gray-900">0</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-8">
				<h3 class="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
						Nuevo Alumno
					</button>
					<button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
						Generar Reporte
					</button>
					<button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
						Gestión Financiera
					</button>
				</div>
			</div>
		</div>
	</main>
</div>
