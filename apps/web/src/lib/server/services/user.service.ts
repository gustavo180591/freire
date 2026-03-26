import { prisma } from '../prisma';
import { hashPassword, validateEmail, validatePassword, validateDNI } from '../auth/hash';
import { ValidationError, ConflictError } from '../utils/errors';

export interface CreateUserData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	dni: string;
	phone?: string;
	birthDate?: string;
}

export class UserService {
	async create(userData: CreateUserData) {
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

		return user;
	}

	async findById(id: number) {
		return await prisma.user.findUnique({
			where: { id },
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
	}

	async findByEmail(email: string) {
		return await prisma.user.findUnique({
			where: { email: email.toLowerCase() }
		});
	}
}
