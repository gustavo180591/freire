<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  export let data: PageData;

  // Estados del formulario
  let showPassword = false;
  let showConfirmPassword = false;
  let password = '';
  let confirmPassword = '';
  let isLoading = false;
</script>

<svelte:head>
  <title>Restablecer Contraseña - Instituto Paulo Freire</title>
  <meta name="description" content="Restablecimiento de contraseña del Instituto Superior de Formación Docente Paulo Freire" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Instituto Paulo Freire</h1>
      <h2 class="mt-2 text-xl text-gray-600">Restablecer Contraseña</h2>
      <p class="mt-2 text-sm text-gray-500">
        Crea tu nueva contraseña para {data.email}
      </p>
    </div>

    <!-- Validación del token -->
    {#if !data.isValid}
      <div class="mb-4 p-4 bg-red-50 border border border-red-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 0 018 8 0zm3.707-9.293a1 1 0 00-1.414 1.414l-4-4a1 1 0 00-1.414 0L8.586 7.414a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Token Inválido</h3>
            <div class="mt-2 text-sm text-red-700">
              El enlace de recuperación ha expirado o es inválido. Por favor solicita un nuevo enlace de recuperación.
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Formulario de restablecimiento -->
    <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
      <form 
        method="POST" 
        use:enhance
        class="space-y-6"
        action="/reset-password/{data.token}"
      >
        <!-- Información del usuario -->
        <div class="bg-blue-50 border border border-blue-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span class="text-white font-medium text-lg">
                  {data.firstName.charAt(0)}{data.lastName.charAt(0)}
                </span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {data.firstName} {data.lastName}
              </h3>
              <p class="text-sm text-gray-500">{data.email}</p>
            </div>
          </div>
        </div>

        <!-- Nueva Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Nueva Contraseña
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              bind:value={password}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
        </div>

        <!-- Confirmar Contraseña -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div class="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              bind:value={confirmPassword}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Repite la nueva contraseña"
            />
          </div>
        </div>

        <!-- Requisitos de contraseña -->
        <div class="bg-gray-50 border border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Requisitos de contraseña:</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            <li class="flex items-center">
              <svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 1.414l-4 4a1 1 0 00-1.414 0L8.586 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" />
              </svg>
              Al menos 8 caracteres
            </li>
            <li class="flex items-center">
              <svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 1.414l-4 4a1 1 0 00-1.414 0L8.586 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" />
              </svg>
              Al menos una mayúscula
            </li>
            <li class="flex items-center">
              <svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 1.414l-4 4a1 1 0 00-1.414 0L8.586 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" />
              </svg>
              Al menos un número
            </li>
            <li class="flex items-center">
              <svg class="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 1.414l-4 4a1 1 0 00-1.414 0L8.586 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 1.414z" />
              </svg>
              Al menos un carácter especial
            </li>
          </ul>
        </div>

        <!-- Botón de envío -->
        <div>
          <button
            type="submit"
            disabled={isLoading}
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Icono de candado -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 015-5h10a5 5 0 012 2v10a2 2 0 01-2 2H6a2 2 0 00-2-2V7a2 2 0 00-2-2h-2zm3.707 8.293a1 1 0 00-1.414 1.414l-3-3a1 1 0 00-1.414 0L8.586 15.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 1.414z" clip-rule="evenodd" />
              </svg>
            </span>
            {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
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
