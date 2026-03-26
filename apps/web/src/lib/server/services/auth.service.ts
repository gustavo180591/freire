import { UserService } from './user.service';
import { verifyPassword } from '../auth/hash';
import { generateAccessToken, generateRefreshToken } from '../auth/jwt';

export interface LoginData {
	email: string;
	password: string;
}

export class AuthService {
	private userService = new UserService();

	async login(loginData: LoginData) {
		// Buscar usuario por email
		const user = await this.userService.findByEmail(loginData.email);
		if (!user) {
			throw new Error('Credenciales inválidas');
		}

		// Verificar contraseña
		const isValidPassword = await verifyPassword(loginData.password, user.password);
		if (!isValidPassword) {
			throw new Error('Credenciales inválidas');
		}

		// Verificar si el usuario está activo
		if (!user.activo) {
			throw new Error('Usuario inactivo');
		}

		// Generar tokens
		const accessToken = generateAccessToken({
			userId: user.id,
			email: user.email,
			roles: [] // TODO: Cargar roles del usuario
		});

		const refreshToken = generateRefreshToken();

		return {
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				dni: user.dni
			},
			tokens: {
				accessToken,
				refreshToken
			}
		};
	}

	async logout(userId: number) {
		// TODO: Implementar invalidación de tokens/sesiones
		return true;
	}

	async validateToken(token: string) {
		// TODO: Implementar validación de token
		return null;
	}
}
