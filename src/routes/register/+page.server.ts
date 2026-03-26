import { fail, redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth';

// Form Actions para registro - Server-First
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    const firstName = data.get('firstName')?.toString();
    const lastName = data.get('lastName')?.toString();
    const role = data.get('role')?.toString();

    // Validación básica
    if (!email || !password || !firstName || !lastName) {
      return fail(400, {
        message: 'Todos los campos son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, {
        message: 'Email inválido'
      });
    }

    // Validar fortaleza de contraseña
    const passwordValidation = AuthService.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return fail(400, {
        message: `Contraseña inválida: ${passwordValidation.errors.join(', ')}`
      });
    }

    // Intentar registrar usuario
    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      role
    });

    if (!result.success) {
      return fail(400, {
        message: result.error
      });
    }

    // Redirigir al login con mensaje de éxito
    throw redirect(303, '/login?message=Registro exitoso. Por favor inicia sesión.');
  }
};
