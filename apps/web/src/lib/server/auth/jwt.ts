// TODO: Implementar gestión de JWT
// - Generar tokens de acceso
// - Generar refresh tokens
// - Validar tokens
// - Rotación de tokens

export interface JWTPayload {
	userId: number;
	email: string;
	roles: string[];
	iat?: number;
	exp?: number;
}

export function generateAccessToken(payload: JWTPayload): string {
	// TODO: Implementar generación de JWT
	return 'temp_token';
}

export function generateRefreshToken(): string {
	// TODO: Implementar generación de refresh token
	return 'temp_refresh_token';
}

export function verifyToken(token: string): JWTPayload | null {
	// TODO: Implementar verificación de JWT
	return null;
}
