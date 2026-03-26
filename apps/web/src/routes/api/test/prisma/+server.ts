import { json } from '@sveltejs/kit';
import { prisma } from '../../../../lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Probar conexión simple
		const userCount = await prisma.user.count();
		
		return json({ 
			message: 'Prisma connection successful',
			userCount: userCount
		});
	} catch (error) {
		console.error('Prisma error:', error);
		return json({ 
			error: 'Prisma connection failed',
			details: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};
