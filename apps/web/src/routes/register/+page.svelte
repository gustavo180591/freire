<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let form: HTMLFormElement;
  let isSubmitting = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);

  // Form data
  let formData = $state({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    birthDate: ''
  });

  // Validation errors
  let errors = $state({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    birthDate: ''
  });

  function validateForm(): boolean {
    let isValid = true;

    // Reset errors
    (Object.keys(errors) as Array<keyof typeof errors>).forEach(key => {
      errors[key] = '';
    });

    // Email validation
    if (!formData.email) {
      errors.email = 'El email es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
      isValid = false;
    }

    // DNI validation (required)
    if (!formData.dni.trim()) {
      errors.dni = 'El DNI es requerido';
      isValid = false;
    } else if (!/^\d{7,9}$/.test(formData.dni)) {
      errors.dni = 'El DNI debe tener entre 7 y 9 dígitos';
      isValid = false;
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'El teléfono no es válido';
      isValid = false;
    }

    // Birth date validation (optional but if provided, must be valid)
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        errors.birthDate = 'Debes ser mayor de 18 años';
        isValid = false;
      }
    }

    return isValid;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }
    isSubmitting = true;
    form.requestSubmit();
  }

  function handleSuccess() {
    goto('/login?message=registro-exitoso');
  }
</script>

<svelte:head>
  <title>Registro - Sistema</title>
  <meta name="description" content="Crea tu cuenta en nuestro sistema" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Crear cuenta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta? 
        <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión
        </a>
      </p>
    </div>

    <form 
      bind:this={form}
      method="POST" 
      action="/api/auth/register"
      use:enhance={({ formData: formFormData, cancel }) => {
        // Add form data to the request
        Object.entries({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dni: formData.dni || null,
          phone: formData.phone || null,
          birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null
        }).forEach(([key, value]) => {
          if (value) {
            formFormData.append(key, value);
          }
        });

        return async ({ result }) => {
          isSubmitting = false;
          
          if (result.type === 'success') {
            handleSuccess();
          } else if (result.type === 'failure') {
            // Handle server validation errors
            if (result.data?.errors) {
              Object.entries(result.data.errors).forEach(([key, message]) => {
                if (key in errors) {
                  errors[key as keyof typeof errors] = message as string;
                }
              });
            } else {
              // Generic error
              alert(result.data?.message || 'Error al registrar usuario');
            }
          }
        };
      }}
      class="mt-8 space-y-6"
      onsubmit={handleSubmit}
    >
      <div class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={formData.email}
            class="mt-1 appearance-none relative block w-full px-3 py-2 border {errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="tu@email.com"
          />
          {#if errors.email}
            <p class="mt-1 text-sm text-red-600">{errors.email}</p>
          {/if}
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña *
          </label>
          <div class="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autocomplete="new-password"
              required
              bind:value={formData.password}
              class="appearance-none relative block w-full px-3 py-2 pr-10 border {errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
              onclick={() => showPassword = !showPassword}
              style="min-width: 2.5rem; min-height: 2.5rem;"
            >
              {#if showPassword}
                <svg class="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: block;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              {:else}
                <svg class="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: block;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {/if}
            </button>
          </div>
          {#if errors.password}
            <p class="mt-1 text-sm text-red-600">{errors.password}</p>
          {/if}
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmar Contraseña *
          </label>
          <div class="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autocomplete="new-password"
              required
              bind:value={formData.confirmPassword}
              class="appearance-none relative block w-full px-3 py-2 pr-10 border {errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
              onclick={() => showConfirmPassword = !showConfirmPassword}
              style="min-width: 2.5rem; min-height: 2.5rem;"
            >
              {#if showConfirmPassword}
                <svg class="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: block;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              {:else}
                <svg class="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: block;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {/if}
            </button>
          </div>
          {#if errors.confirmPassword}
            <p class="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          {/if}
        </div>

        <!-- Personal Information Section -->
        <div class="border-t border-gray-200 pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                Nombre *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                required
                bind:value={formData.firstName}
                class="mt-1 appearance-none relative block w-full px-3 py-2 border {errors.firstName ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Juan"
              />
              {#if errors.firstName}
                <p class="mt-1 text-sm text-red-600">{errors.firstName}</p>
              {/if}
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Apellido *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                required
                bind:value={formData.lastName}
                class="mt-1 appearance-none relative block w-full px-3 py-2 border {errors.lastName ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Pérez"
              />
              {#if errors.lastName}
                <p class="mt-1 text-sm text-red-600">{errors.lastName}</p>
              {/if}
            </div>
          </div>

          <!-- DNI -->
          <div class="mt-4">
            <label for="dni" class="block text-sm font-medium text-gray-700">
              DNI *
            </label>
            <input
              id="dni"
              name="dni"
              type="text"
              autocomplete="off"
              bind:value={formData.dni}
              class="mt-1 appearance-none relative block w-full px-3 py-2 border {errors.dni ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="12345678"
            />
            {#if errors.dni}
              <p class="mt-1 text-sm text-red-600">{errors.dni}</p>
            {/if}
          </div>

          <!-- Phone -->
          <div class="mt-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Teléfono (opcional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              bind:value={formData.phone}
              class="mt-1 appearance-none relative block w-full px-3 py-2 border {errors.phone ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="+54 9 11 1234 5678"
            />
            {#if errors.phone}
              <p class="mt-1 text-sm text-red-600">{errors.phone}</p>
            {/if}
          </div>

          <!-- Birth Date -->
          <div class="mt-4">
            <label for="birthDate" class="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento (opcional)
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              autocomplete="bday"
              bind:value={formData.birthDate}
              class="mt-1 appearance-none relative block w-full px-3 py-2 border {errors.birthDate ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              max={new Date().toISOString().split('T')[0]}
            />
            {#if errors.birthDate}
              <p class="mt-1 text-sm text-red-600">{errors.birthDate}</p>
            {/if}
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registrando...
          {:else}
            Crear cuenta
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>