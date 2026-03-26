import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const formData = await request.formData();
		
		const loginData = {
			email: formData.get('email')?.toString() || '',
			password: formData.get('password')?.toString() || ''
		};

		// Validaciones básicas
		if (!loginData.email || !loginData.password) {
			return json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
		}

		// Validar formato de email
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
			return json({ error: 'Email inválido' }, { status: 400 });
		}

		// Simulación de login (sin base de datos por ahora)
		// En producción, aquí buscaríamos el usuario en la BD
		const mockUser = {
			id: 123,
			email: loginData.email,
			firstName: 'Demo',
			lastName: 'User',
			dni: '12345678'
		};

		// Generar tokens simples (sin JWT por ahora)
		const accessToken = `access_token_${Date.now()}_${mockUser.id}`;
		const refreshToken = `refresh_token_${Date.now()}_${mockUser.id}`;

		// Establecer cookies seguras
		cookies.set('access_token', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 15 // 15 minutos
		});

		cookies.set('refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 7 días
		});

		console.log('✅ Login exitoso para:', mockUser.email);

		return json({
			message: 'Login exitoso',
			user: mockUser
		});

	} catch (error) {
		console.error('❌ Error en login:', error);
		return json(
			{ 
				error: 'Error interno del servidor',
				message: 'No se pudo iniciar sesión. Por favor, inténtalo de nuevo.'
			},
			{ status: 500 }
		);
	}
};
