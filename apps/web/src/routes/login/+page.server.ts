import { json, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword, validateEmail, validatePassword } from '$lib/server/auth/hash';
import { ValidationError, UnauthorizedError } from '$lib/server/utils/errors';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// 📥 Captura de datos del formulario de forma segura
		const formData = await request.formData();
		
		const loginData = {
			email: formData.get('email')?.toString() || '',
			password: formData.get('password')?.toString() || ''
		};

		console.log('📥 Datos de login recibidos:', {
			email: loginData.email,
			password: loginData.password ? '***' : 'null'
		});

		// 🔍 Validaciones
		if (!validateEmail(loginData.email)) {
			console.log('❌ Email inválido:', loginData.email);
			return fail(400, { message: 'Email inválido' });
		}

		if (!validatePassword(loginData.password)) {
			console.log('❌ Contraseña débil:', loginData.password.length, 'caracteres');
			return fail(400, { message: 'La contraseña debe tener al menos 8 caracteres' });
		}

		if (!loginData.email || !loginData.password) {
			console.log('❌ Campos obligatorios faltantes');
			return fail(400, { message: 'Email y contraseña son requeridos' });
		}

		// 🔐 Verificación de credenciales en base de datos
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
			console.log('❌ Usuario no encontrado:', loginData.email);
			return fail(401, { message: 'Credenciales inválidas' });
		}

		// 🔐 Verificación de contraseña
		const isValidPassword = await hashPassword(loginData.password);
		const isPasswordValid = await hashPassword(loginData.password);
		if (isValidPassword !== user.password) {
			console.log('❌ Contraseña incorrecta para:', loginData.email);
			return fail(401, { message: 'Credenciales inválidas' });
		}

		// ✅ Verificación de estado del usuario
		if (!user.activo) {
			console.log('❌ Usuario inactivo:', loginData.email);
			return fail(401, { message: 'Usuario inactivo' });
		}

		// 👥 Obtener roles del usuario
		const roles = user.userRoles.map(ur => ur.role.name);

		// 🍪 Generación de tokens simples (sin JWT por ahora)
		const accessToken = `access_token_${Date.now()}_${user.id}`;
		const refreshToken = `refresh_token_${Date.now()}_${user.id}`;

		// 🍪 Creación de RefreshToken en base de datos
		await prisma.refreshToken.create({
			data: {
				userId: user.id,
				token: refreshToken,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
				revoked: false,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});

		// 🍪 Establecer cookies seguras
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

		// 🔄 Actualizar último login
		await prisma.user.update({
			where: { id: user.id },
			data: {
				lastLogin: new Date(),
				updatedAt: new Date()
			}
		});

		console.log('✅ Login exitoso para:', {
			email: user.email,
			nombre: `${user.firstName} ${user.lastName}`,
			roles: roles
		});

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
		
		// 🚨 Manejo específico de errores
		if (error instanceof ValidationError) {
			console.log('❌ Error de validación:', error.message);
			return fail(400, { message: error.message });
		}
		
		if (error instanceof UnauthorizedError) {
			console.log('❌ Error de autorización:', error.message);
			return fail(401, { message: error.message });
		}

		console.error('❌ Error interno del servidor:', error);
		return fail(500, { 
			message: 'Error interno del servidor. Por favor, inténtalo de nuevo.' 
		});
	}
};