import { fail, redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth';
import type { Actions } from './$types';

// Form Action para recuperación de contraseña - Server-First
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();

    // Validación básica
    if (!email) {
      return fail(400, {
        message: 'El email es obligatorio'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        message: 'Email inválido'
      });
    }

    // Verificar si el usuario existe
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      // No revelar si el email existe o no por seguridad
      return fail(200, {
        message: 'Si el email está registrado, recibirás un enlace de recuperación'
      });
    }

    // Generar token de recuperación (método a implementar en AuthService)
    const resetToken = await AuthService.generatePasswordResetToken(user.id);
    
    // Guardar token en la base de datos
    await AuthService.savePasswordResetToken(user.id, resetToken);

    // En desarrollo, mostrar el token (para testing)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Token de recuperación para ${email}: ${resetToken}`);
    }

    return {
      success: true,
      message: 'Si el email está registrado, recibirás un enlace de recuperación'
    };
  }
};
