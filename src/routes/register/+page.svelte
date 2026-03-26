<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // Obtener mensaje de la URL (ej: después de registro exitoso)
  $: message = '';
  
  if ($page.url.searchParams.has('message')) {
    message = $page.url.searchParams.get('message');
  }
</script>

<svelte:head>
  <title>Registro - Instituto Paulo Freire</title>
  <meta name="description" content="Formulario de registro del Instituto Superior de Formación Docente Paulo Freire" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Instituto Paulo Freire</h1>
      <h2 class="mt-2 text-xl text-gray-600">Crear cuenta de usuario</h2>
      <p class="mt-2 text-sm text-gray-500">
        Completa el formulario para registrarte en el sistema
      </p>
    </div>

    <!-- Mensaje de éxito -->
    {#if message}
      <div class="mb-4 p-4 bg-green-50 border border border-green-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 0 018 8 0zm3.707-9.293a1 1 0 00-1.414 1.414l-4-4a1 1 0 00-1.414 0L8.586 7.414a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Registro exitoso</h3>
            <div class="mt-2 text-sm text-green-700">
              {@html message}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Formulario de registro -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <form 
        method="POST" 
        use:enhance
        class="space-y-6"
        action="/register"
      >
        <!-- Nombre -->
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <div class="mt-1">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Juan"
            />
          </div>
        </div>

        <!-- Apellido -->
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <div class="mt-1">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Pérez"
            />
          </div>
        </div>

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
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
        </div>

        <!-- Rol (opcional) -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">
            Rol (opcional)
          </label>
          <div class="mt-1">
            <select
              id="role"
              name="role"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Seleccionar rol...</option>
              <option value="ALUMNO">Alumno</option>
              <option value="DOCENTE">Docente</option>
              <option value="COORDINADOR_CARRERA">Coordinador de Carrera</option>
            </select>
          </div>
        </div>

        <!-- Botón de registro -->
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Icono de usuario -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 0 3 3 0 016 6 0zm3.707-8.293a1 1 0 00-1.414 1.414l-3-3a1 1 0 00-1.414 0L8.586 5.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 1.414z" clip-rule="evenodd" />
              </svg>
            </span>
            Registrarse
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
            <span class="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
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
