<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  // Obtener mensaje de la URL
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
  <title>Recuperar Contraseña - Instituto Paulo Freire</title>
  <meta name="description" content="Recuperación de contraseña del Instituto Superior de Formación Docente Paulo Freire" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Instituto Paulo Freire</h1>
      <h2 class="mt-2 text-xl text-gray-600">Recuperar Contraseña</h2>
      <p class="mt-2 text-sm text-gray-500">
        Ingresa tu email institucional y te enviaremos un enlace para restablecer tu contraseña
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
            <h3 class="text-sm font-medium text-green-800">Instrucciones enviadas</h3>
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

    <!-- Formulario de recuperación -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <form 
        method="POST" 
        use:enhance
        class="space-y-6"
        action="/forgot-password"
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
              required
              autocomplete="email"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="juan.perez@paulofreire.edu"
            />
          </div>
        </div>

        <!-- Información de seguridad -->
        <div class="bg-blue-50 border border border-blue-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 015-5h10a5 5 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 00-2-2h-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9l7 7 7-7" />
              </svg>
            </div>
            <div class="ml-3 text-sm text-blue-700">
              <h3 class="font-medium">Recuperación Segura</h3>
              <ul class="mt-2 list-disc list-inside space-y-1">
                <li>El enlace de recuperación expirará en 1 hora</li>
                <li>Por seguridad, no confirmaremos si el email está registrado</li>
                <li>El enlace solo puede usarse una vez</li>
                <li>Si no recibes el email, verifica tu carpeta de spam</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Botón de envío -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Icono de email -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.5l7.997 3.616A2 2 0 011.657 4l-7.997-3.616A2 2 0 01-2.003 5.884z" />
              </svg>
            </span>
            Enviar Enlace de Recuperación
          </button>
        </div>
      </form>

      <!-- Enlace a login -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">¿Recordaste tu contraseña?</span>
          </div>
        </div>
        <div class="mt-2 text-center">
          <a
            href="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  </div>
</main>
