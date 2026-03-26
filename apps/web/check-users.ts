import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: ['query']
});

async function checkUsers() {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			dni: true,
			createdAt: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 5
	});

	console.log('📋 Últimos usuarios registrados:');
	users.forEach((user, index) => {
		console.log(`${index + 1}. ${user.firstName} ${user.lastName} - ${user.email} - DNI: ${user.dni}`);
		console.log(`   Creado: ${user.createdAt.toLocaleString('es-AR')}`);
		console.log('');
	});

	await prisma.$disconnect();
}

checkUsers().catch(console.error);
