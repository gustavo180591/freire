<script lang="ts">
  let name = 'Sistema Paulo Freire';
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg w-full">
    
    <h1 class="text-3xl font-bold text-gray-800 mb-4">
      🎓 {name}
    </h1>

    <p class="text-gray-600 mb-6">
      Sistema Integral de Gestión Académica
    </p>

    <div class="flex flex-col gap-4">
      <a href="/login" class="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Iniciar sesión
      </a>

      <a href="/register" class="bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
        Registrarse
      </a>

      <a href="/api/test" target="_blank" class="text-sm text-gray-500 underline">
        Test API
      </a>
    </div>

  </div>
</main>