<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  export let data: PageData;

  // Datos del dashboard (ejemplo estático)
  let stats = {
    totalUsers: 1250,
    activeUsers: 890,
    totalInscriptions: 3420,
    pendingInscriptions: 156,
    completedCourses: 89,
    activeCourses: 12
  };

  // Componentes dinámicos del dashboard
  let recentActivities = [
    {
      id: 1,
      type: 'registration',
      user: 'María González',
      course: 'Licenciatura en Educación Primaria',
      time: 'Hace 2 horas',
      icon: '📝'
    },
    {
      id: 2,
      type: 'login',
      user: 'Juan Pérez',
      time: 'Hace 3 horas',
      icon: '🔐'
    },
    {
      id: 3,
      type: 'grade',
      user: 'Ana Rodríguez',
      course: 'Matemáticas II - 2° Año',
      time: 'Hace 5 horas',
      icon: '📊'
    }
  ];
</script>

<svelte:head>
  <title>Dashboard - Instituto Paulo Freire</title>
  <meta name="description" content="Panel principal del Instituto Superior de Formación Docente Paulo Freire" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <!-- Header con información del usuario -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-white font-medium">
                {data.user.firstName.charAt(0)}{data.user.lastName.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">
              {data.user.firstName} {data.user.lastName}
            </h1>
            <p class="text-sm text-gray-500">{data.user.email}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
            {data.user.role}
          </span>
          
          <!-- Botón de logout -->
          <form method="POST" action="/login?/logout">
            <button
              type="submit"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  </header>

  <!-- Contenido principal del dashboard -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Tarjetas de estadísticas -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Total Usuarios -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 100-8 0 4 4 018.646 0L4.354 16.354a4 4 0 100-8 0 4 4 018.646 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 011-8 0 4 4 0zM12 14a7 7 0 100-7 7 0 017-7 7 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                <dd class="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Usuarios Activos -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 0 014-2h4a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
                <dd class="text-lg font-medium text-gray-900">{stats.activeUsers}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Inscripciones Totales -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9l7 7 7-7" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Inscripciones</dt>
                <dd class="text-lg font-medium text-gray-900">{stats.totalInscriptions}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Inscripciones Pendientes -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h4m-4 0h4m-4 0h4m-4 0h4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                <dd class="text-lg font-medium text-gray-900">{stats.pendingInscriptions}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actividad Reciente -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Actividad Reciente</h3>
        
        <div class="flow-root">
          <ul class="-mb-8">
            {#each recentActivities as activity}
              <li>
                <div class="flex items-start space-x-3 py-4">
                  <div class="flex-shrink-0">
                    <div class="text-2xl">{activity.icon}</div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm text-gray-500">
                      <span class="font-medium text-gray-900">{activity.user}</span>
                      {activity.type === 'registration' && ' se inscribió en'}
                      {activity.type === 'login' && ' inició sesión'}
                      {activity.type === 'grade' && ' calificó'}
                      <span class="mx-1">{activity.course}</span>
                    </p>
                    <p class="mt-0.5 text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</main>
