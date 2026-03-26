import type { Handle } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';

// Hook global para validación de sesión - Server-First
export const handle: Handle = async ({ event, resolve }) => {
  // Obtener token de sesión de la cookie
  const sessionToken = event.cookies.get('session-token');

  // Si hay token de sesión, validar y cargar usuario
  if (sessionToken) {
    try {
      // Verificar token de sesión (método a implementar en AuthService)
      const user = await AuthService.validateSessionToken(sessionToken);
      
      if (user) {
        // Establecer usuario en locals para acceso global
        event.locals.user = user;
      } else {
        // Token inválido, eliminar cookie
        event.cookies.delete('session-token', { path: '/' });
      }
    } catch (error) {
      console.error('Error validando sesión:', error);
      event.cookies.delete('session-token', { path: '/' });
    }
  }

  // Continuar con la solicitud
  const response = await resolve(event);

  // Headers de seguridad para todas las respuestas
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
};

// Hook para seguridad de tipos
export const handleError: Handle = async ({ error, event }) => {
  console.error('Error en la aplicación:', error);

  // En desarrollo, mostrar error detallado
  if (process.env.NODE_ENV === 'development') {
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // En producción, redirigir a página de error
  return new Response('Error interno del servidor', {
    status: 500
  });
};
