<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // Obtener mensaje de la URL (ej: después de logout)
  $: message = '';
  $: error = '';
  
  if ($page.url.searchParams.has('message')) {
    message = $page.url.searchParams.get('message');
  }
  
  if ($page.url.searchParams.has('error')) {
    error = $page.url.searchParams.get('error');
  }
</script>

<svelte:head>
  <title>Iniciar Sesión - Instituto Paulo Freire</title>
  <meta name="description" content="Portal de acceso del Instituto Superior de Formación Docente Paulo Freire" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Instituto Paulo Freire</h1>
      <h2 class="mt-2 text-xl text-gray-600">Portal de Acceso</h2>
      <p class="mt-2 text-sm text-gray-500">
        Ingresa tus credenciales para acceder al sistema
      </p>
    </div>

    <!-- Mensajes -->
    {#if message}
      <div class="mb-4 p-4 bg-green-50 border border border-green-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 0 018 8 0zm3.707-9.293a1 1 0 00-1.414 1.414l-4-4a1 1 0 00-1.414 0L8.586 7.414a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Éxito</h3>
            <div class="mt-2 text-sm text-green-700">
              {message}
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if error}
      <div class="mb-4 p-4 bg-red-50 border border border-red-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 0 018 8 0zm3.707-9.293a1 1 0 00-1.414 1.414l-4-4a1 1 0 00-1.414 0L8.586 7.414a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Formulario de login -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <form 
        method="POST" 
        use:enhance
        class="space-y-6"
        action="/login"
      >
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email institucional
          </label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="juan.perez@paulofreire.edu"
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>

        <!-- Recordarme -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Recordarme en este dispositivo
            </label>
          </div>

          <div class="text-sm">
            <a
              href="/forgot-password"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <!-- Botón de login -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Icono de candado -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 015-5h10a5 5 0 015 5v2a5 5 0 015-5H5a5 5 0 00-5-5zm3.707 8.293a1 1 0 00-1.414 1.414l-3-3a1 1 0 00-1.414 0L8.586 15.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 1.414z" clip-rule="evenodd" />
              </svg>
            </span>
            Iniciar Sesión
          </button>
        </div>
      </form>

      <!-- Enlace a registro -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
          </div>
        </div>
        <div class="mt-2 text-center">
          <a
            href="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  </div>
</main>
