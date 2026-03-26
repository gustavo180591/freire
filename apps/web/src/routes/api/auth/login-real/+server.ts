import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient({
	log: ['query']
});

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

		// Buscar usuario en la base de datos
		const user = await prisma.user.findUnique({
			where: { email: loginData.email.toLowerCase() },
			include: {
				userRoles: {
					include: {
						role: true
					}
				}
			}
		});

		if (!user) {
			return json({ error: 'Credenciales inválidas' }, { status: 401 });
		}

		// Verificar contraseña
		const isValidPassword = await bcrypt.compare(loginData.password, user.password);
		if (!isValidPassword) {
			return json({ error: 'Credenciales inválidas' }, { status: 401 });
		}

		// Verificar si el usuario está activo
		if (!user.activo) {
			return json({ error: 'Usuario inactivo' }, { status: 401 });
		}

		// Obtener roles del usuario
		const roles = user.userRoles.map(ur => ur.role.name);

		// Generar tokens simples (sin JWT por ahora)
		const accessToken = `access_token_${Date.now()}_${user.id}`;
		const refreshToken = `refresh_token_${Date.now()}_${user.id}`;

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

		console.log('✅ Login exitoso para:', user.email);

		return json({
			message: 'Login exitoso',
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				dni: user.dni,
				roles: roles
			}
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
	} finally {
		await prisma.$disconnect();
	}
};
