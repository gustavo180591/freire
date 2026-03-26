import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// Proteger página de dashboard - Server-First
export const load: PageServerLoad = async ({ locals, url }) => {
  // Verificar si el usuario está autenticado
  if (!locals.user) {
    // Redirigir a login con parámetro de retorno
    throw redirect(303, `/login?error=Debes iniciar sesión para acceder al dashboard&returnTo=${encodeURIComponent(url.pathname)}`);
  }

  // Usuario autenticado - cargar datos adicionales si es necesario
  return {
    user: locals.user,
    // Aquí podrías cargar datos específicos del dashboard
    // como estadísticas, notificaciones, etc.
  };
};
