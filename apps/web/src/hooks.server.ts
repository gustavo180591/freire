import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

// Middleware de autenticación
const authHandle: Handle = async ({ event, resolve }) => {
	// Rutas que no requieren autenticación
	const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/system/health'];
	
	const isPublicRoute = publicRoutes.some(route => 
		event.url.pathname.startsWith(route)
	);

	// Si es una ruta pública, continuar normalmente
	if (isPublicRoute) {
		return resolve(event);
	}

	// Verificar si hay token de acceso
	const accessToken = event.cookies.get('access_token');
	
	if (!accessToken) {
		// Si no hay token y es una ruta API, devolver 401
		if (event.url.pathname.startsWith('/api/')) {
			return new Response('Unauthorized', { status: 401 });
		}
		
		// Si es una ruta del frontend, redirigir a login
		return Response.redirect(new URL('/login', event.url), 302);
	}

	// Validar token y cargar datos del usuario
	try {
		// Extraer ID del token (formato: access_token_timestamp_userid)
		const tokenParts = accessToken.split('_');
		if (tokenParts.length !== 3) {
			console.log('❌ Token inválido:', accessToken);
			return Response.redirect(new URL('/login', event.url), 302);
		}

		const userId = parseInt(tokenParts[2]);
		
		// Buscar usuario en la base de datos
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				userRoles: {
					include: {
						role: true
					}
				}
			}
		});

		if (!user) {
			console.log('❌ Usuario no encontrado para token:', accessToken);
			return Response.redirect(new URL('/login', event.url), 302);
		}

		// Verificar si el usuario está activo
		if (!user.activo) {
			console.log('❌ Usuario inactivo:', user.email);
			return Response.redirect(new URL('/login', event.url), 302);
		}

		// Obtener roles del usuario
		const roles = user.userRoles.map(ur => ur.role.name);

		// Poner datos del usuario en el evento global
		event.locals.user = {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			dni: user.dni,
			roles: roles
		};

		console.log('✅ Usuario autenticado:', user.email);

		return resolve(event);

	} catch (error) {
		console.error('❌ Error en middleware de autenticación:', error);
		
		// En caso de error, limpiar datos de usuario y redirigir a login
		event.locals.user = null;
		
		return Response.redirect(new URL('/login', event.url), 302);
	}
};

// Middleware de logging
const loggingHandle: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const response = await resolve(event);
	const duration = Date.now() - start;
	
	console.log(`${event.request.method} ${event.url.pathname} - ${response.status} (${duration}ms)`);
	
	return response;
};

export const handle = sequence(loggingHandle, authHandle);
