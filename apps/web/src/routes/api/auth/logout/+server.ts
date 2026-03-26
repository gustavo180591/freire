import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// 🍪 Obtener tokens de las cookies
		const accessToken = cookies.get('access_token');
		const refreshToken = cookies.get('refresh_token');

		if (!accessToken || !refreshToken) {
			return json({ message: 'No hay sesión activa' }, { status: 400 });
		}

		// 🔄 Extraer ID del token
		const tokenParts = accessToken.split('_');
		if (tokenParts.length !== 3) {
			console.log('❌ Token inválido en logout:', accessToken);
			return json({ error: 'Token inválido' }, { status: 400 });
		}

		const userId = parseInt(tokenParts[2]);

		// 🗄️ Invalidar refresh token en la base de datos
		await prisma.refreshToken.updateMany({
			where: {
				userId: userId,
				revoked: false
			},
			data: {
				revoked: true,
				updatedAt: new Date()
			}
		});

		// 🍪 Limpiar cookies de sesión
		cookies.delete('access_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		cookies.delete('refresh_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/'
		});

		console.log('✅ Logout exitoso para usuario ID:', userId);

		return json({
			message: 'Sesión cerrada exitosamente'
		});

	} catch (error) {
		console.error('❌ Error en logout:', error);
		return json(
			{ 
				error: 'Error interno del servidor',
				message: 'No se pudo cerrar sesión. Por favor, inténtalo de nuevo.'
			},
			{ status: 500 }
		);
	}
};
