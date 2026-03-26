import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/server/auth/hash';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Iniciando seed de la base de datos...');

	// Limpiar datos existentes
	console.log('🧹 Limpiando datos existentes...');
	await prisma.refreshToken.deleteMany();
	await prisma.userRole.deleteMany();
	await prisma.role.deleteMany();
	await prisma.user.deleteMany();

	// Crear roles básicos
	console.log('👥 Creando roles...');
	const roles = await Promise.all([
		prisma.role.create({
			data: {
				name: 'admin',
				description: 'Administrador del sistema'
			}
		}),
		prisma.role.create({
			data: {
				name: 'docente',
				description: 'Docente del instituto'
			}
		}),
		prisma.role.create({
			data: {
				name: 'alumno',
				description: 'Alumno del instituto'
			}
		}),
		prisma.role.create({
			data: {
				name: 'administrativo',
				description: 'Personal administrativo'
			}
		})
	]);

	// Crear usuarios de prueba
	console.log('👤 Creando usuarios de prueba...');
	const adminPassword = await hashPassword('admin123');
	const docentePassword = await hashPassword('docente123');
	const alumnoPassword = await hashPassword('alumno123');

	const users = await Promise.all([
		// Administrador
		prisma.user.create({
			data: {
				email: 'admin@freire.edu',
				password: adminPassword,
				firstName: 'Administrador',
				lastName: 'Sistema',
				dni: '11111111',
				phone: '+5491111111111',
				birthDate: new Date('1980-01-01'),
				activo: true,
				emailVerified: true
			}
		}),
		// Docente
		prisma.user.create({
			data: {
				email: 'docente@freire.edu',
				password: docentePassword,
				firstName: 'Juan',
				lastName: 'Pérez',
				dni: '22222222',
				phone: '+5492222222222',
				birthDate: new Date('1975-05-15'),
				activo: true,
				emailVerified: true
			}
		}),
		// Alumno
		prisma.user.create({
			data: {
				email: 'alumno@freire.edu',
				password: alumnoPassword,
				firstName: 'María',
				lastName: 'González',
				dni: '33333333',
				phone: '+5493333333333',
				birthDate: new Date('2000-03-20'),
				activo: true,
				emailVerified: false
			}
		})
	]);

	// Asignar roles a los usuarios
	console.log('🔗 Asignando roles a usuarios...');
	await Promise.all([
		// Admin -> admin role
		prisma.userRole.create({
			data: {
				userId: users[0].id,
				roleId: roles[0].id // admin
			}
		}),
		// Docente -> docente role
		prisma.userRole.create({
			data: {
				userId: users[1].id,
				roleId: roles[1].id // docente
			}
		}),
		// Alumno -> alumno role
		prisma.userRole.create({
			data: {
				userId: users[2].id,
				roleId: roles[2].id // alumno
			}
		})
	]);

	console.log('✅ Seed completado exitosamente!');
	console.log('');
	console.log('📋 Usuarios creados:');
	console.log('   Admin: admin@freire.edu / admin123');
	console.log('   Docente: docente@freire.edu / docente123');
	console.log('   Alumno: alumno@freire.edu / alumno123');
	console.log('');
	console.log('👥 Roles creados:');
	roles.forEach(role => {
		console.log(`   - ${role.name}: ${role.description}`);
	});
}

main()
	.catch((e) => {
		console.error('❌ Error en el seed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
