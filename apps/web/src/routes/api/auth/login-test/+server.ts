import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('🔍 Debug: Endpoint de prueba simple');
		
		const formData = await request.formData();
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		
		console.log('📥 Datos recibidos:', { email, password: password ? '***' : 'null' });
		
		// Simulación simple sin base de datos
		if (email === 'alumno@freire.edu' && password === 'alumno123') {
			return json({
				message: 'Login exitoso (simulado)',
				user: {
					id: 3,
					email: email,
					firstName: 'María',
					lastName: 'González',
					roles: ['alumno']
				}
			});
		}
		
		return json({ error: 'Credenciales inválidas' }, { status: 401 });

	} catch (error) {
		console.error('❌ Error en login-simple:', error);
		return json(
			{ 
				error: 'Error interno del servidor',
				message: 'No se pudo iniciar sesión. Por favor, inténtalo de nuevo.'
			},
			{ status: 500 }
		);
	}
};
