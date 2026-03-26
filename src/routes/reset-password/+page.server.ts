import { fail, redirect, error } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

// Validación del token y carga de datos
export const load: PageServerLoad = async ({ params, url }) => {
  const { token } = params;
  
  if (!token) {
    throw error(400, 'Token de recuperación no proporcionado');
  }

  // Verificar token en la base de datos
  const resetData = await AuthService.validatePasswordResetToken(token);
  
  if (!resetData.isValid) {
    throw error(400, 'Token inválido o expirado');
  }

  return {
    token,
    email: resetData.user?.email || '',
    firstName: resetData.user?.firstName || '',
    isValid: resetData.isValid
  };
};

// Form Action para reinicio de contraseña - Server-First
export const actions: Actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const { token } = params;
    
    const password = data.get('password')?.toString();
    const confirmPassword = data.get('confirmPassword')?.toString();

    // Validaciones básicas
    if (!password || !confirmPassword) {
      return fail(400, {
        message: 'Todos los campos son obligatorios'
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        message: 'Las contraseñas no coinciden'
      });
    }

    // Validar fortaleza de contraseña
    const passwordValidation = AuthService.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return fail(400, {
        message: `Contraseña inválida: ${passwordValidation.errors.join(', ')}`
      });
    }

    // Verificar token nuevamente (seguridad adicional)
    const resetData = await AuthService.validatePasswordResetToken(token);
    if (!resetData.isValid || !resetData.user) {
      return fail(400, {
        message: 'Token inválido o expirado'
      });
    }

    // Actualizar contraseña
    const success = await AuthService.updatePassword(resetData.user.id, password);
    
    if (!success) {
      return fail(500, {
        message: 'Error al actualizar la contraseña'
      });
    }

    // Invalidar todos los tokens del usuario
    await AuthService.invalidateAllPasswordResetTokens(resetData.user.id);

    throw redirect(303, '/login?message=Contraseña actualizada exitosamente. Por favor inicia sesión.');
  }
};
