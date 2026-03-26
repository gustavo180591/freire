import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient({
	log: ['query']
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		
		const userData = {
			email: formData.get('email')?.toString() || '',
			password: formData.get('password')?.toString() || '',
			firstName: formData.get('firstName')?.toString() || '',
			lastName: formData.get('lastName')?.toString() || '',
			dni: formData.get('dni')?.toString() || '',
			phone: formData.get('phone')?.toString() || '',
			birthDate: formData.get('birthDate')?.toString() || ''
		};

		// Validaciones
		if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.dni) {
			return json({ error: 'Faltan campos obligatorios' }, { status: 400 });
		}

		// Validar formato de email
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
			return json({ error: 'Email inválido' }, { status: 400 });
		}

		// Validar contraseña
		if (userData.password.length < 8) {
			return json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
		}

		// Validar DNI
		if (!/^\d{7,9}$/.test(userData.dni)) {
			return json({ error: 'El DNI debe tener entre 7 y 9 dígitos' }, { status: 400 });
		}

		// Verificar si el usuario ya existe
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: userData.email.toLowerCase() },
					{ dni: userData.dni }
				]
			}
		});

		if (existingUser) {
			if (existingUser.email === userData.email.toLowerCase()) {
				return json({ error: 'El email ya está registrado' }, { status: 409 });
			}
			if (existingUser.dni === userData.dni) {
				return json({ error: 'El DNI ya está registrado' }, { status: 409 });
			}
		}

		// Hashear contraseña
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Crear usuario
		const user = await prisma.user.create({
			data: {
				email: userData.email.toLowerCase(),
				password: hashedPassword,
				firstName: userData.firstName.trim(),
				lastName: userData.lastName.trim(),
				dni: userData.dni.trim(),
				phone: userData.phone ? userData.phone.trim() : null,
				birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
				activo: true,
				emailVerified: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				dni: true,
				createdAt: true
			}
		});

		// Asignar rol de alumno por defecto
		const alumnoRole = await prisma.role.findUnique({
			where: { name: 'alumno' }
		});

		if (alumnoRole) {
			await prisma.userRole.create({
				data: {
					userId: user.id,
					roleId: alumnoRole.id
				}
			});
		}

		console.log('✅ Usuario creado exitosamente:', user.email);

		return json({
			message: 'Usuario creado exitosamente',
			user
		}, { status: 201 });

	} catch (error) {
		console.error('❌ Error en registro:', error);
		
		return json(
			{ 
				error: 'Error interno del servidor',
				message: 'No se pudo crear el usuario. Por favor, inténtalo de nuevo.'
			},
			{ status: 500 }
		);
	}
};
