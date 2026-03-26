import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword, validateEmail, validatePassword, validateDNI } from '$lib/server/auth/hash';
import { ValidationError, ConflictError } from '$lib/server/utils/errors';
import type { RequestHandler } from './$types';

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
		if (!validateEmail(userData.email)) {
			throw new ValidationError('Email inválido');
		}

		if (!validatePassword(userData.password)) {
			throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
		}

		if (!validateDNI(userData.dni)) {
			throw new ValidationError('El DNI debe tener entre 7 y 9 dígitos');
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
				throw new ConflictError('El email ya está registrado');
			}
			if (existingUser.dni === userData.dni) {
				throw new ConflictError('El DNI ya está registrado');
			}
		}

		// Hashear contraseña
		const hashedPassword = await hashPassword(userData.password);

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
		
		// Manejar errores específicos
		if (error instanceof ValidationError) {
			return json({ error: error.message }, { status: 400 });
		}
		
		if (error instanceof ConflictError) {
			return json({ error: error.message }, { status: 409 });
		}

		return json(
			{ 
				error: 'Error interno del servidor',
				message: 'No se pudo crear el usuario. Por favor, inténtalo de nuevo.'
			},
			{ status: 500 }
		);
	}
};
