import { json, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword, validateEmail, validatePassword, validateDNI } from '$lib/server/auth/hash';
import { ValidationError, ConflictError } from '$lib/server/utils/errors';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// 📥 Captura de datos del formulario de forma segura
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

		console.log('📥 Datos recibidos:', {
			email: userData.email,
			password: userData.password ? '***' : 'null',
			firstName: userData.firstName,
			lastName: userData.lastName,
			dni: userData.dni,
			phone: userData.phone,
			birthDate: userData.birthDate
		});

		// 🔍 Validaciones
		if (!validateEmail(userData.email)) {
			console.log('❌ Email inválido:', userData.email);
			return fail(400, { message: 'Email inválido' });
		}

		if (!validatePassword(userData.password)) {
			console.log('❌ Contraseña débil:', userData.password.length, 'caracteres');
			return fail(400, { message: 'La contraseña debe tener al menos 8 caracteres' });
		}

		if (!validateDNI(userData.dni)) {
			console.log('❌ DNI inválido:', userData.dni);
			return fail(400, { message: 'El DNI debe tener entre 7 y 9 dígitos' });
		}

		if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.dni) {
			console.log('❌ Campos obligatorios faltantes');
			return fail(400, { message: 'Faltan campos obligatorios' });
		}

		// 🔍 Verificación de duplicados en base de datos
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: userData.email.toLowerCase() },
					{ dni: userData.dni }
				]
			}
		});

		if (existingUser) {
			console.log('❌ Usuario ya existe:', {
				existingEmail: existingUser.email === userData.email.toLowerCase(),
				existingDNI: existingUser.dni === userData.dni
			});

			if (existingUser.email === userData.email.toLowerCase()) {
				console.log('❌ Email duplicado:', userData.email);
				return fail(409, { message: 'El email ya está registrado' });
			}

			if (existingUser.dni === userData.dni) {
				console.log('❌ DNI duplicado:', userData.dni);
				return fail(409, { message: 'El DNI ya está registrado' });
			}
		}

		// 🔐 Hashing de contraseña (nunca en texto plano)
		const hashedPassword = await hashPassword(userData.password);
		console.log('🔐 Contraseña hasheada correctamente');

		// 💾 Persistencia con transacción para asegurar integridad
		const result = await prisma.$transaction(async (tx) => {
			// 1️⃣ Crear usuario
			const user = await tx.user.create({
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

			// 2️⃣ Asignar rol por defecto (ALUMNO)
			const alumnoRole = await tx.role.findUnique({
				where: { name: 'alumno' }
			});

			if (alumnoRole) {
				await tx.userRole.create({
					data: {
						userId: user.id,
						roleId: alumnoRole.id
					}
				});
			}

			console.log('✅ Usuario creado exitosamente:', {
				id: user.id,
				email: user.email,
				nombre: `${user.firstName} ${user.lastName}`,
				rol: 'ALUMNO'
			});

			return user;
		});

		// 🎉 Éxito: Devolver datos al formulario sin recargar
		return json({
			message: 'Usuario creado exitosamente',
			user: {
				id: result.id,
				email: result.email,
				firstName: result.firstName,
				lastName: result.lastName,
				dni: result.dni
			}
		});

	} catch (error) {
		console.error('❌ Error en registro:', error);
		
		// 🚨 Manejo específico de errores
		if (error instanceof ValidationError) {
			console.log('❌ Error de validación:', error.message);
			return fail(400, { message: error.message });
		}
		
		if (error instanceof ConflictError) {
			console.log('❌ Error de conflicto:', error.message);
			return fail(409, { message: error.message });
		}

		console.error('❌ Error interno del servidor:', error);
		return fail(500, { 
			message: 'Error interno del servidor. Por favor, inténtalo de nuevo.' 
		});
	}
};