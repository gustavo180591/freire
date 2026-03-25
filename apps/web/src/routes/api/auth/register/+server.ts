import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		
		// Probar Prisma
		console.log('Intentando conectar a Prisma...');
		const count = await prisma.user.count();
		console.log('Conexión exitosa, usuarios:', count);
		
		return json({ 
			message: 'Prueba exitosa',
			received: body,
			userCount: count
		}, { status: 200 });
		
		const email = body.email;
		const password = body.password;
		const firstName = body.firstName;
		const lastName = body.lastName;
		const dni = body.dni;
		const phone = body.phone || '';
		const birthDate = body.birthDate || '';

		// Validaciones básicas
		if (!email || !password || !firstName || !lastName || !dni) {
			return json({ 
				error: 'Email, password, firstName, lastName y dni son requeridos',
				errors: {
					email: !email ? 'El email es requerido' : '',
					password: !password ? 'La contraseña es requerida' : '',
					firstName: !firstName ? 'El nombre es requerido' : '',
					lastName: !lastName ? 'El apellido es requerido' : '',
					dni: !dni ? 'El DNI es requerido' : ''
				}
			}, { status: 400 });
		}

		// Validación de formato de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ 
				error: 'El email no es válido',
				errors: { email: 'El email no es válido' }
			}, { status: 400 });
		}

		// Validación de contraseña
		if (password.length < 8) {
			return json({ 
				error: 'La contraseña debe tener al menos 8 caracteres',
				errors: { password: 'La contraseña debe tener al menos 8 caracteres' }
			}, { status: 400 });
		}

		// Validación de DNI
		if (!/^\d{7,9}$/.test(dni)) {
			return json({ 
				error: 'El DNI debe tener entre 7 y 9 dígitos',
				errors: { dni: 'El DNI debe tener entre 7 y 9 dígitos' }
			}, { status: 400 });
		}

		// Validación de teléfono (si se proporciona)
		if (phone && !/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''))) {
			return json({ 
				error: 'El teléfono no es válido',
				errors: { phone: 'El teléfono no es válido' }
			}, { status: 400 });
		}

		// Validación de fecha de nacimiento (si se proporciona)
		if (birthDate) {
			const birthDateObj = new Date(birthDate);
			const today = new Date();
			const age = today.getFullYear() - birthDateObj.getFullYear();
			const monthDiff = today.getMonth() - birthDateObj.getMonth();
			
			if (age < 18 || (age === 18 && monthDiff < 0)) {
				return json({ 
					error: 'Debes ser mayor de 18 años',
					errors: { birthDate: 'Debes ser mayor de 18 años' }
				}, { status: 400 });
			}
		}

		// Verificar si el usuario ya existe
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return json({ 
				error: 'El usuario ya existe',
				errors: { email: 'El email ya está registrado' }
			}, { status: 400 });
		}

		// Verificar si el DNI ya existe
		const existingDni = await prisma.user.findFirst({
			where: { dni }
		});

		if (existingDni) {
			return json({ 
				error: 'El DNI ya está registrado',
				errors: { dni: 'El DNI ya está registrado' }
			}, { status: 400 });
		}

		// Hashear contraseña
		const hashedPassword = await bcrypt.hash(password, 10);

		// Crear nuevo usuario
		const user = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				password: hashedPassword,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				dni: dni.trim(),
				phone: phone ? phone.trim() : null,
				birthDate: birthDate ? new Date(birthDate) : null,
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
				phone: true,
				birthDate: true,
				activo: true,
				emailVerified: true,
				createdAt: true
			}
		});

		return json({ 
			message: 'Usuario creado exitosamente',
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				dni: user.dni,
				phone: user.phone,
				birthDate: user.birthDate,
				activo: user.activo,
				emailVerified: user.emailVerified,
				createdAt: user.createdAt
			}
		}, { status: 201 });

	} catch (error) {
		console.error('Error en registro:', error);
		console.error('Error details:', JSON.stringify(error, null, 2));
		
		// Manejar errores específicos de Prisma
		if (error instanceof Error) {
			// Error de constraint unique
			if (error.message.includes('Unique constraint')) {
				if (error.message.includes('email')) {
					return json({ 
						error: 'El email ya está registrado',
						errors: { email: 'El email ya está registrado' }
					}, { status: 400 });
				}
				if (error.message.includes('dni')) {
					return json({ 
						error: 'El DNI ya está registrado',
						errors: { dni: 'El DNI ya está registrado' }
					}, { status: 400 });
				}
			}
		}

		return json({ 
			error: 'Error interno del servidor',
			message: 'No se pudo crear el usuario. Por favor, inténtalo de nuevo.'
		}, { status: 500 });
	}
};