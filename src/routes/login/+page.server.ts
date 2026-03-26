import { fail, redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth';
import type { Actions } from './$types';

// Form Actions para login - Server-First
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    // Validación básica
    if (!email || !password) {
      return fail(400, {
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        message: 'Email inválido'
      });
    }

    // Intentar autenticar
    const result = await AuthService.login(email, password);

    if (!result.success) {
      return fail(401, {
        message: result.error
      });
    }

    // Generar token de sesión (más seguro que JWT para frontend)
    const sessionToken = await AuthService.generateSessionToken(result.user!);

    // Establecer cookie de sesión segura
    cookies.set('session-token', sessionToken, {
      path: '/',
      httpOnly: true, // No accesible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict', // Protección CSRF
      maxAge: 60 * 60 * 24 // 24 horas
    });

    // Redirigir al dashboard
    throw redirect(303, '/dashboard');
  },

  // Logout action
  logout: async ({ request, cookies }) => {
    const data = await request.formData();
    const refreshToken = data.get('refreshToken')?.toString();

    // Invalidar refresh token si existe
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    // Eliminar cookie de sesión
    cookies.delete('session-token', { path: '/' });

    // Redirigir al login con mensaje
    throw redirect(303, '/login?message=Sesión cerrada exitosamente');
  }
};
